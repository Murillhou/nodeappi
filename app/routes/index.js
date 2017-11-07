const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  acl = require(path.join(rootPath, 'app', 'components', 'acl')).acl,
  getUserName = require(path.join(rootPath, 'app', 'components', 'authentication'))
  .functions.getUserName;

router.post('/authenticate', require('./authenticate'));

router.post('/users',
  /*[
     passport.authenticate('jwt', { session: false }),
     acl.middleware(2, getUserName, 'post')
   ],*/
  require('./post-users'));

router.use('/mqtt', require('./mqtt'));

router.use('/slack', require('./slack'));

router.get('/', require('./hello'));

module.exports = router;