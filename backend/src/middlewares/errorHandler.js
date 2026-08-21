const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`[EXCEPTION CAUGHT]: ${err.stack || err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "An unexpected server error occurred.",
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = errorHandler;
