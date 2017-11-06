const _ = require('lodash'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  users = [{ user: process.env.user, passowrd: process.env.password }];

module.exports = passport => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = process.env.authenticationSecret;
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