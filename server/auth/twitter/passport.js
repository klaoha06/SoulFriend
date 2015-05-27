exports.setup = function (User, config) {
  var passport = require('passport');
  var TwitterStrategy = require('passport-twitter').Strategy;

  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    profileFields: ['name', 'emails', 'photos'], 
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'twitter.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          username: profile.username.substring(0,24),
          role: 'user',
          provider: 'twitter',
          summary: profile._json['description'],
          coverimg: profile._json['profile_image_url'],
          twitter: {
            id: profile._json['id'],
            id_str: profile._json['id_str'],
            name: profile._json['name']
          }
        });
        user.save(function(err) {
          if (err) return done(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
    }
  ));
};