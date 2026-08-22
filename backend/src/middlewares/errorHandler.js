const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`[EXCEPTION CAUGHT]: ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;

  const message =
    statusCode >= 500
      ? "An unexpected server error occurred."
      : err.message || "Something went wrong.";

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = errorHandler;
