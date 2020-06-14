const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const {OAuth2Client} = require('google-auth-library');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
    const {name, email, password} = req.body

    User.findOne({email}).exec((err, user) => {
        if (user){
            return res.status(400).json({
                error: 'Email already exists'
            });
        }
        //activation key is needed to make sure the token was created by our app
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'}); 

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject:`Account activation link`,
            html: `
                <h2>Please use the following link to reset your password: </h2>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information, and is not monitored. Please do not reply to this email.</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        }
        sgMail.send(emailData)
        .then(sent => {
            //console.log('SIGNUP EMAIL SENT', sent)
            res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account`
            })
            
        })
        .catch((error) => {
            console.log(error)
        })
    });

};

exports.accountActivation = (req, res) => {
    const {token} = req.body

    if (token) {
        //token includes secret key, so checking if they match
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR: ', err)
                return res.status(401).json({
                    error: 'Expired link, pleas sign up again'
                })
            }
            const {name, email, password} = jwt.decode(token)

            const user = new User({name, email, password})
            user.save((err, user) =>{
                if (err){
                    console.log('SAVE USER ERROR: ', err)
                    res.status(401).json({
                        error: 'Error saving user in database, please try to signup again'
                    });
                }
                return res.json({
                    message: 'Signup success, user added'
                })
            });
        });
    }
    else {
        return res.json({
            message: 'No token, please try again'
        })
        
    }
};

exports.signin = (req, res) => {
    const {email, password} = req.body
    //check if user exists in DB
    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist, please try again or Sign up'
            });
        }
        //Attempt to match user password with one saved in DB for this user
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email or password incorrect'
            });
        }
        //user found and password match, generate token and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        const {_id, name, email, role} = user

        return res.json({
            token,
            user: {_id, name, email, role}
        });
    });
};

//adds req.user._id property to the request object
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
});

exports.adminMiddleware = (req, res, next) => {
    User.findById({_id: req.user._id}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'User is not admin. Access denied'
            });
        }
        req.profile = user;
        next();
    });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {
    const {idToken} = req.body

    client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID}).then(response =>{
        const {email_verified, name, email} = response.payload
        if(email_verified) {
            User.findOne({email}).exec((err, user) => {
                if (user) {
                    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
                    const {_id, email, name, role} = user
                    return res.json({
                        token, user: {_id, email, name, role}
                    })
                }
                else {
                    let password = email + process.env.JWT_SECRET
                    user = new User({name, email, password})
                    //used data variable because user was already taken from above
                    user.save((err, data) => {
                        if (err) {
                            console.log('ERROR ON GOOGLE LOGIN SAVING USER', err)
                            return res.status(400).json({
                                error: 'Google user signup failed'
                            })
                        }
                        const token = jwt.sign({_id: data._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
                        const {_id, email, name, role} = data
                        return res.json({
                            token, user: {_id, email, name, role}
                        });
                    });
                }
            })
        }
        else {
            return res.status(400).json({
                error: 'Google login failed. Try again'
            })
        }
    })
}

exports.forgotPassword = (req, res) => {
    const {email} = req.body;
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            })
        }
        const token = jwt.sign({_id: user._id, name: user.name}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'}); 

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject:`Parallel password assistance`,
            html: `
                <h2>Please use the following link to reset your password: </h2>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information, and is not monitored. Please do not reply to this email.</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        };

        return user.updateOne({reset_link: token}, (err, success) =>{
            if (err) {
                return res.status(400).json({
                    error: 'Database connection error for user password forget request'
                });
            }
            else {
                sgMail.send(emailData)
                .then(sent => {
                    //console.log('SIGNUP EMAIL SENT', sent)
                    res.json({
                        message: `Email has been sent to ${email}. Follow the instructions to reset your password`
                    })
                })
                .catch((error) => {
                    return res.json({
                        message: err.message
                    });
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const {reset_link, newPassword} = req.body;

    if(reset_link) {
        jwt.verify(reset_link, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired reset link, please try again.'
                });
            }
            User.findOne({reset_link}, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'Its us not you..Please try again later'
                    });
                }
                const updatedFields = {
                    password: newPassword,
                    reset_link: ''
                }
                user = _.extend(user, updatedFields);

                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Error updating user password. Please try again'
                        });
                    }
                    res.json({
                        message: `Password updated successfully!`
                    });
                });
            });
        });
    }
    else {
        return res.status(400).json({
            error: 'Invalid link. Please try again'
        });
    }
};















// exports.signup = (req, res) => {
//     //console.log('REQ BODY ON SIGNUP', req.body);
//     const {name, email, password} = req.body

//     User.findOne({email}).exec((err, user) => {
//         if (user){
//             return res.status(400).json({
//                 error: 'Email already exists'
//             });
//         }
//     })
//     let newUser = new User({name, email, password})
    
//     newUser.save((err, success) => {
//         if (err) {
//             console.log('signup error', err)
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json({
//             message: 'singup successful! Please sing in',
//             user: {
//                 name: newUser.name, 
//                 email: newUser.email
//             }
//         });
//     });
// };