const User = require('../models/user');

exports.read = (req, res) => {
    const userID = req.params.id;
    User.findById(userID).exec((err, user) =>{
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
};

exports.update = (req, res) => {
  console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const {name, password} = req.body
  User.findOne({_id: req.user._id}, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
            error: 'User not found'
        });
      }
      if (!name) {
        return res.status(400).json({
            error: 'Name is required'
        });
      } else {
          user.name = name
      }
      if (password) {
          if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be six characters long'
            });
          } else {
            user.password = password;
        }
      }

      user.save((err, updatedUser) => {
          if (err) {
            console.log("USER UPDATE ERROR", err);
            return res.status(400).json({
                error: 'User update failed, please try again'
            });
          }
          updatedUser.hashed_password = undefined;
          updatedUser.salt = undefined;
          res.json(updatedUser);
      });
  });
};

exports.updateLocation = (userId, locationId) => {
  User.findOne({ _id: userId }, (err, user) => {
    if (err || !user) {
      return err;
    }
    if (locationId) {
      user.locations.insertOne(locationId);
    }
    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return err;
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      return updatedUser;
    });
  })
}