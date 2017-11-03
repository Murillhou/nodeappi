const _ = require('lodash'),
  jwt = require('jwt-simple'),
  path = require('path'),
  config = require(path.join(__dirname, 'config')),
  users = require(path.join(__dirname, 'users'));

// Function that get the token from the request
const getToken = (req, res) => {
  if(req.headers && req.headers.authorization) {
    var parted = req.headers.authorization.split(' ');
    if(parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
// This gets the user id from a encoded token
const getUserId = (req, res) => {
  var decoded = jwt.decode(getToken(req, res), config.secret);
  return decoded[0].user;
};

const authenticateUser = (req, res) => {
  const user = _.filter(users, o => o.user === req.body.user && o.password === req.body.password);
  if(user.length === 1) {
    res.status(200).send({
      success: true,
      token: 'JWT ' + jwt.encode(user, config.secret)
    });
  } else {
    res.status(400).send({
      success: false,
      msg: 'Authentication failed. Wrong password.'
    });
  }
};

module.exports = {
  authenticateUser,
  getToken,
  getUserId
};