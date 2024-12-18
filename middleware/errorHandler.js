export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
res.status(500 || err.status).json({
    success: false,
    error: "Internal server error",
    details: err.message
  });
}