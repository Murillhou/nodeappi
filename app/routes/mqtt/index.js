const passport = require('passport'),
  express = require('express'),
  router = express.Router(),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  acl = require(path.join(rootPath, 'app', 'components', 'acl')).acl,
  endpoints = require(path.join(__dirname, 'endpoints')),
  clientsMqtt = require(path.join(rootPath, 'app', 'services', 'mqtt-clients')),
  getUserName = require(path.join(rootPath, 'app', 'components', 'authentication'))
  .functions.getUserName;

router.post('/publish', [
    passport.authenticate('jwt', { session: false }), acl.middleware(2, getUserName, 'post')
  ],
  endpoints.getPublishEndpoint(clientsMqtt));

router.get('/',
  passport.authenticate('jwt', { session: false }),
  require('./hello'));

module.exports = router;