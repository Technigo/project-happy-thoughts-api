export default (err, req, res, next) => {
  err.type = err.type || 'error';
  
  // handle validation errors
  if (err.name === 'ValidationError') {
    err.message = err.errors.message.message
    err.statusCode = err.statusCode || 400;
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      type: err.type,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      error: err.type,
      message: err.message
    });
  }
};
