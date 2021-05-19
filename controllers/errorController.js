export default (err, req, res, next) => {
  const messages = [];
  err.type = err.type || 'Error';

  // handle validation errors
  if (err.name === 'ValidationError') {
    err.statusCode = err.statusCode || 400;
    if (err.errors.message) {
      messages.push(err.errors.message.message);
    }
    if (err.errors.category) {
      messages.push(err.errors.category.message);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      type: err.type,
      error: err,
      message: messages.length > 0 ? messages : err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      type: err.type,
      message: messages.length > 0 ? messages : err.message
    });
  }
};
