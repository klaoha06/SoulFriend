'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var random = require('mongoose-simple-random');
var email = require('../../email/email.service');

var UserSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  coverimg: String,
  email: String,
  verificationCode: String,
  emailVerification: { type: Boolean, default: false},
  username: String,
  role: {
    type: String,
    default: 'user'
  },
  summary: String,
  reason: String,
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  questions_id: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  questions_count: {type: Number, default: 0},
  ansInQuestions_id: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  answers_count: {type: Number, default: 0},
  jais_count: {type: Number, default: 0},
  jais_id: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  comments_count: {type: Number, default: 0},
  follower_id: [{type: Schema.Types.ObjectId, ref: 'User'}],
  follower_count:{type: Number, default: 0},
  following_id: [{type: Schema.Types.ObjectId, ref: 'User'}],
  following_count:{type: Number, default: 0}
});

UserSchema.plugin(random);

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'email': this.email,
      'name': this.name,
      'emailVerification': this.emailVerification,
      'username': this.username,
      'role': this.role,
      'coverimg': this.coverimg,
      'summary': this.summary,
      'reason': this.reason,
      'questions_id': this.questions_id,
      'questions_count': this.questions_count,
      'jais_count': this.jais_count,
      'answers_count': this.answers_count,
      'follower_count': this.follower_count,
      'follower_id': this.follower_id,
      'following_count': this.following_count,
      'following_id': this.following_id
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      if (!this.coverimg || this.coverimg === '') {
        this.coverimg = 'http://flathash.com/' + crypto.randomBytes(6).toString('base64');
      }
      this.verificationCode = crypto.randomBytes(64).toString('base64');
      email.sendEmailOnSignUp({ email: this.email, verificationCode: this.verificationCode});
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },
  sendVerificationEmail: function(){
    return email.sendEmailOnSignUp({ email: this.email, verificationCode: this.verificationCode});
  }
};

module.exports = mongoose.model('User', UserSchema);
