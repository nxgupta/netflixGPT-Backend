let errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    msg: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
