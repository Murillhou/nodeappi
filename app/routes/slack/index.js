const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  acl = require(path.join(rootPath, 'app', 'components', 'acl')).acl,
  endpoints = require('./endpoints'),
  slackBot = require(path.join(rootPath.toString(), 'app', 'services', 'slack-bot')),
  getUserName = require(path.join(rootPath, 'app', 'components', 'authentication'))
  .functions.getUserName;

router.post('/postmessage', [
    passport.authenticate('jwt', { session: false }),
    acl.middleware(2, getUserName, 'post')
  ],
  endpoints.getPostMessageEndpoint(slackBot));

router.get('/',
  passport.authenticate('jwt', { session: false }),
  require('./hello'));

module.exports = router;