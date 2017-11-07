const _ = require('lodash'),
  jwt = require('jwt-simple'),
  path = require('path');

const buildToken = user => 'JWT ' + jwt.encode(user, process.env.authenticationSecret);

// Function that get the token from the request
const getToken = (req, res) => {
  if(req.headers && req.headers.authorization) {
    const parted = req.headers.authorization.split(' ');
    if(parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
// This gets the user name from a encoded token
const getUserName = (req, res) =>
  jwt.decode(getToken(req, res), process.env.authenticationSecret).username;

const authenticateUser = (user, password) =>
  _.filter(
    require(path.join(__dirname, 'users')),
    o => o.user === user && o.password === password
  ).length === 1;

module.exports = {
  authenticateUser,
  buildToken,
  getToken,
  getUserName
};