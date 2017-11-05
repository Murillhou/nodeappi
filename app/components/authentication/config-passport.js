const _ = require('lodash'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  path = require('path'),
  config = require(path.join(__dirname, 'config.json')),
  users = require(path.join(__dirname, 'users.json'));

module.exports = passport => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      if(_.find(users, o => o.user == jwtPayload[0].user && o.password == jwtPayload[0].password)) {
        return done(null, jwtPayload);
      } else {
        return done(null, false);
      }
    })
  );
};