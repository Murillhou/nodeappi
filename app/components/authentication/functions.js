// Required files, libraries and modules
const _ = require('lodash'),
  jwt = require('jwt-simple'),
  path = require('path'),
  conf = require(path.join(require('app-root-path').toString(), 'app', 'config'));

const buildToken = user => 'JWT ' + jwt.encode(user, conf.authenticationSecret);

/**
 * Get the token from the request
 * @param {express.request} req 
 * @param {express.response} res 
 */
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
/**
 * This gets the user name from a encoded token
 * @param {express.request} req 
 * @param {express.response} res 
 */
const getUserName = (req, res) =>
  jwt.decode(getToken(req, res), conf.authenticationSecret).username;
/**
 * 
 * @param {String} user 
 * @param {String} password 
 */
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