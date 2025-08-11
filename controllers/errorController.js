module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
