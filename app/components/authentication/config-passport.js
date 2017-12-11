// Required files, libraries and modules
const conf = require(require('path').join(require('app-root-path').toString(), 'app', 'config')),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

/**
 * Configures a given passport instance with JWT strategy and using
 * the provided mongoose user model findOne (by ID) method.
 * @param {passport} passportInstance passport library instance
 * @param {mongoose.Model} mongooseUserModel mongoose users model
 */
const config = (passportInstance, mongooseUserModel) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = conf.authenticationSecret;
  passportInstance.use(new JwtStrategy(opts, function(jwt_payload, done) {
    mongooseUserModel.findOne({ id: jwt_payload.id }, function(error, user) {
      if(error) {
        return done(error, false);
      }
      if(user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};

module.exports = config;