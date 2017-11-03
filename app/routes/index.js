const express = require('express'),
  router = express.Router();

router.use('/mqtt', require('./mqtt'));
router.use('/slack', require('./slack'));
router.get('/', require('./hello'))

module.exports = router;