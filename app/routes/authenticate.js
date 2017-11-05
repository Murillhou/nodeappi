const path = require('path'),
  rootPath = require('app-root-path'),
  authFunctions = require(path.join(rootPath.toString(), 'app', 'components', 'authentication')).functions;

module.exports = (req, res) => {
  if(authFunctions.authenticateUser(req.user, req.password)) {
    res.status(200).send({
      success: true,
      token: authFunctions.buildToken(req.user)
    });
  } else {
    res.status(400).send({
      success: false,
      msg: 'Authentication failed. Wrong password.'
    });
  }
};