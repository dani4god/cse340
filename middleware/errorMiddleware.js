/* ****************************************
*  Error Handling Middleware
*  Place after all other middleware
**************************************** */

// Express error handler (must have 4 parameters)
function errorHandler(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Set status code
  const status = err.status || 500;
  res.status(status);
  
  // Log error to console
  console.error(`Error ${status}: ${err.message}`);
  if (req.app.get('env') === 'development') {
    console.error(err.stack);
  }
  
  // Render error view
  res.render('errors/error', {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    message: err.message,
    status: status,
    nav: res.locals.nav || ''
  });
}

// 404 handler - catch all unmatched routes
function notFoundHandler(req, res, next) {
  const err = new Error('Sorry, the page you are looking for does not exist.');
  err.status = 404;
  next(err);
}

module.exports = { errorHandler, notFoundHandler };
