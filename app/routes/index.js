const express = require('express'),
  router = express.Router(),
  passport = require('passport');

router.post('/authenticate', require('./authenticate'));
router.post('/users', passport.authenticate('jwt', { session: false }), require('./post-users'));
router.use('/mqtt', require('./mqtt'));
router.use('/slack', require('./slack'));
router.get('/', require('./hello'));

module.exports = router;