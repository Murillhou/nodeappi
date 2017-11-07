/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema;

// set up a mongoose model
const UserSchema = new Schema({
  usertype: {
    type: Array,
    required: true
  },
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
  const user = this;
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
  const upd = this.getUpdate();
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