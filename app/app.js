// Required files, libraries and modules
const path = require('path'),
  rootPath = require('app-root-path'),
  express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cors = require('cors'),
  helmet = require('helmet'),
  routes = require(path.join(__dirname, 'routes')),
  auth = require(path.join(__dirname, 'components', 'authentication'));

// Initialize express app
const app = express();

// pass passport for configuration
require(path.join(__dirname, 'components', 'authentication', 'passport'))(passport);

//Logger
app.use(morgan('dev'));

// Apply middlewares (ensure order)
app.use(cors());
app.use(helmet());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Ensure valid origin, initialize locals and find logged in user
// app.use(initLocals);
// app.use(ensureValidOrigin);
// app.use(authenticate);

// Mount routes 
app.get('/', (req, res) => res.render('index', {
  bodyheader: 'Node.js + express simple API.',
  bodytext: `This project is purely educational and its aim is to establish a set of JS coding good 
  practics and style when writing an API with node and express. It is intended to be successively 
  improved not only on better code style and organization but also with additional features.`
}));
app.get('/apihome', (req, res) => res.render('api', {
  bodyheader: 'API reference',
  bodytext: `The current API just exposes a few methods from some popular service and application 
  interfaces. It is self documented, as the root path "/" reponds to GET 
  with a list of the available REST endpoints on the first level; currently POST "/authenticate" 
  and POST/GET "/api". This last route and the ones on the next levels also behave on the same 
  way. `
}));
app.get('/contact', (req, res) => res.render('contact', {
  bodyheader: 'Contact',
  author: 'Murillhou',
  email: 'murillhou@gmail.com'
}));
app.post('/authenticate', auth);
app.use('/api', routes);

// Serve static content
app.set('views', path.join(rootPath.toString(), 'views'));
app.locals.basedir = path.join(__dirname, 'views');
app.set('view engine', 'pug');
app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.render('error');
});

module.exports = app;