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
          user = new User({
            name: {
              first: profile.name.givenName,
              last: profile.name.familyName
            },
            coverimg: profile.photos[0].value,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username || profile.displayName,
            provider: 'facebook',
            facebook: {
                  link: profile.profileUrl,
                  id: profile.id
                }
          });
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