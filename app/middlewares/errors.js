module.exports = {
  errorHandler: (err, req, res, next) => {
    res.status(err.status || 500);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.render('error');
  },
  catch404: (req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};