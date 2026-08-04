const pinoHttp = require("pino-http");
const logger = require("../utils/logger");

const httpLogger = pinoHttp({
  logger,
  // Customizes the success log message format
  customSuccessMessage: (req, res) => {
    return `HTTP ${req.method} ${req.url} completed with status ${res.statusCode}`;
  },
  // Customizes the error log message format
  customErrorMessage: (req, res, error) => {
    return `HTTP ${req.method} ${req.url} failed with status ${res.statusCode}: ${error.message}`;
  },
  // Serializers allow you to control exactly what data gets logged
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      query: req.query,
      // Avoid logging sensitive headers like Authorization tokens for security
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

module.exports = httpLogger;
