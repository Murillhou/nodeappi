const path = require('path'),
  rootPath = require('app-root-path').toString(),
  userController = require(path.join(rootPath, 'app', 'components', 'users')).controller;

module.exports = userController.postUsersREST;