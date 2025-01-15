const ApiError = require("../utils/apiError");

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid Token. Please login again", 401);

const sendErrorDev = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });

const sendErrorProd = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });

const globalError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error = handleJwtInvalidSignature();
    }
    sendErrorProd(error, res);
  }
};

module.exports = globalError;
