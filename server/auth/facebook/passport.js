var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ['name', 'picture.type(large)', 'emails', 'displayName', 'profileUrl', 'locale'], 
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log(profile)
          user = new User({
            role: 'user',
            provider: 'facebook',
            facebook: {
                  id: profile.id
                }
          });
          if (profile.profileUrl){
            user.facebook.link = profile.profileUrl
          }
          if (profile.name.givenName) {
            user.name.first = profile.name.givenName
          }
          if (profile.name.familyName) {
            user.name.last = profile.name.familyName
          }
          if (profile.username) {
            user.username = profile.username.substring(0, 24)
          }
          if (profile.displayName && !profile.username) {
            user.username = profile.displayName.substring(0, 24)
          }
          if (profile.photos) {
            user.coverimg = profile.photos[0].value
          }
          if (profile.emails) {
            user.email = profile.emails[0].value;
          }
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      })
    }
  ));
};