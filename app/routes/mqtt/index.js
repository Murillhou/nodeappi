const passport = require('passport'),
  express = require('express'),
  router = express.Router(),
  path = require('path'),
  rootPath = require('app-root-path'),
  endpoints = require('./endpoints'),
  clientsMqtt = require(path.join(rootPath.toString(), 'app', 'services', 'mqtt-clients'));

router.post('/publish', passport.authenticate('jwt', { session: false }),
  endpoints.getPublishEndpoint(clientsMqtt));
router.get('/', require('./hello'));

module.exports = router;