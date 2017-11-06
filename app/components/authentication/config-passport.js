const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  User = require(path.join(rootPath, 'app', 'components', 'users', 'model', 'user'));

module.exports = passport => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = process.env.authenticationSecret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({ id: jwt_payload.id }, function(err, user) {
      if(err) {
        return done(err, false);
      }
      if(user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};