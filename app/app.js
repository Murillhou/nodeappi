// Required files, libraries and modules
const path = require('path'),
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
app.post('/authenticate', auth);
app.use('/api', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    msg: err.message,
    err: err.error
  });
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // // render the error page
  // res.render('error');
});

module.exports = app;