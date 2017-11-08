const express = require('express'),
  router = express.Router();

router.get('/', (req, res) => res.render('index', {
  bodyheader: 'Node.js + express simple API.',
  bodytext: `This project is purely educational and its aim is to establish a set of JS coding good 
      practics and style when writing an API with node and express. It is intended to be successively 
      improved not only on better code style and organization but also with additional features.`
}));
router.get('/apihome', (req, res) => res.render('api', {
  bodyheader: 'API reference',
  bodytext: `The current API just exposes a few methods from some popular service and application 
      interfaces. It is self documented, as the root path "/api" reponds to GET 
      with a list of the available REST endpoints on the first level.`
}));
router.get('/contact', (req, res) => res.render('contact', {
  bodyheader: 'Contact',
  author: 'Murillhou',
  email: 'murillhou@gmail.com'
}));

module.exports = router;