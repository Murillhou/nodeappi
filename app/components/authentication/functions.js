const _ = require('lodash'),
  jwt = require('jwt-simple'),
  path = require('path');

const buildToken = user => 'JWT ' + jwt.encode(user, process.env.authentication.secret);

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
const getUserId = (req, res) =>
  jwt.decode(getToken(req, res), process.env.authentication.secret)[0].user;

const authenticateUser = (user, password) =>
  _.filter(
    require(path.join(__dirname, 'users')),
    o => o.user === user && o.password === password
  ).length === 1;

module.exports = {
  authenticateUser,
  buildToken,
  getToken,
  getUserId
};