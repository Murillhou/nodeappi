// Required files, libraries and modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cors = require('cors'),
  helmet = require('helmet'),
  path = require('path'),
  rootPath = require('app-root-path'),
  errorMidd = require(path.join(__dirname, 'middlewares', 'errors')),
  authentication = require(path.join(__dirname, 'components', 'authentication')),
  routes = require(path.join(__dirname, 'routes')),
  static = require(path.join(__dirname, 'static'));

// Initialize express app
const app = express();

// pass passport for configuration
authentication.configPassport(passport);

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
app.use('/api', routes);

// Serve static content
app.locals.basedir = path.join(__dirname, 'views');
app.set('views', path.join(rootPath.toString(), 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(static);

// Handle errors
app.use(errorMidd.errorHandler);
app.use(errorMidd.catch404);


module.exports = app;