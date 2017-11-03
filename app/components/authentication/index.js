const express = require('express'),
  router = express.Router(),
  f = require('./functions');


router.post('/authenticate', f.authenticateUser);
module.exports = router;