const path = require('path'),
  rootPath = require('app-root-path').toString(),
  errorlog = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi_middlewares_errors').error;
module.exports = (err, req, res, next) => {
  res.status(err.status || 500);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // log the error
  errorlog(err);
  // render the error page
  res.render('error');
};