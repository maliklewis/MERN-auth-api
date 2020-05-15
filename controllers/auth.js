const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
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
                <h2>Please use the following link to activate your account: </h2>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information, and is not monitored. Please do not reply to this email.</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        }
        sgMail.send(emailData).then(sent => {
            //console.log('SIGNUP EMAIL SENT', sent)
            res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account`
            })
            .catch((error) => {
                console.log(error)
            })
        });
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
        })
    });
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