const logger = require("../utils/logger");

// Express recognizes this as an error-handling middleware because it has exactly 4 arguments
const errorHandler = (err, req, res, next) => {
  // 1. Log the full exception stack trace internally using Pino
  logger.error(`[EXCEPTON CAUGHT]: ${err.stack || err.message}`);

  // 2. Determine the status code (default to 500 Internal Server Error)
  const statusCode = err.statusCode || 500;

  // 3. Provide a structured, meaningful JSON response to the user
  res.status(statusCode).json({
    error: {
      message: err.message || "An unexpected server error occurred.",
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = errorHandler;
