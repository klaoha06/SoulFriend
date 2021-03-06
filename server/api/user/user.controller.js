'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');


var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Get sample of users
 */
exports.sampleusers = function(req, res) {
  User.findRandom({reason:{'$ne': null}},'username reason coverimg',{limit: 9}, function (err, users) {
    if(err) return res.send(500, err);
    return res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token, user: user.profile });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  User.findById(req.params.id,function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.status(200).json(user.profile);
  });
};

exports.addFollowerFollowing = function(req, res, next) {
  User.findById(req.params.currentUserId, function (err, user) {
      user.following_id.push(req.params.questionOwnerId);
      user.following_count++;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).json(user.profile);
      });
  });
  User.findById(req.params.questionOwnerId, function(err, user){
    if (err) {console.log(err)}
    user.follower_id.push(req.params.currentUserId)
    user.follower_count++;
    user.save()
  })
};

exports.removeFollowerFollowing = function(req, res, next) {
  User.findById(req.params.currentUserId, function (err, user) {
      user.following_id.pull(req.params.questionOwnerId);
      user.following_count--;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).json(user.profile);
      });
  });
  User.findById(req.params.questionOwnerId, function(err, user){
    if (err) {console.log(err)}
    user.follower_id.pull(req.params.currentUserId)
    user.follower_count--;
    user.save()
  })
};

/**
 *  Verify user
 */
exports.verify = function (req, res, next) {
  User.findOne({verificationCode: req.params.hex}, function (err, user) {
    if (err) return next(err);
    if (user) {
      user.emailVerification = true;
      user.save();
      return res.redirect('http://www.puanjai.com/verified');
    } else {
      return res.redirect('http://www.puanjai.com/notverified');
    }
  });
};

exports.sendVerificationEmail = function(req,res,next){
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
      user.sendVerificationEmail();
      return res.send(200)
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.editProfile = function(req, res, next) {
  var user = req.user;
  var updated;
  User.findById(user._id, function (err, user) {
    if(user.provider === 'local') {
      if(user.authenticate(req.body.user.password)) {
        delete req.body.user.password
        updated = _.merge(user, req.body.user);
        updated.save(function(err) {
          if (err) return validationError(res, err);
          res.send(200);
        });
      } else {
        res.send(403);
      }
    } else {
      delete req.body.user.password
      updated = _.merge(user, req.body.user);
      updated.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword -verificationCode', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
