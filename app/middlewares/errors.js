const path = require('path'),
  rootPath = require('app-root-path').toString(),
  errorlog = require(path.join(rootPath, 'app', 'components', 'logging'))('nodeappi').error;
module.exports = {
  errorHandler: (err, req, res, next) => {
    res.status(err.status || 500);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // log the error
    errorlog('--ERROR-- ' + err);
    // render the error page
    res.render('error');
  },
  catch404: (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};