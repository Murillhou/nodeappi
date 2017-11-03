const passport = require('passport'),
  express = require('express'),
  router = express.Router(),
  path = require('path'),
  rootPath = require('app-root-path'),
  endpoints = require('./endpoints'),
  slackBot = require(path.join(rootPath.toString(), 'app', 'services', 'slack-bot'));

router.post('/postmessage', passport.authenticate('jwt', { session: false }),
  endpoints.getPostMessageEndpoint(slackBot));
router.get('/', require('./hello'));

module.exports = router;