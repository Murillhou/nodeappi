/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// set up a mongoose model
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if(err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function() {}, function(err, hash) {
        if(err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.pre('update', function(next) {
  var upd = this.getUpdate();
  if(upd.$set.password) {
    bcrypt.genSalt(10, function(err, salt) {
      if(err) {
        return next(err);
      }
      bcrypt.hash(upd.$set.password, salt, function() {}, function(err, hash) {
        if(err) {
          return next(err);
        }
        upd.$set.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if(err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);