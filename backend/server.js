const app = require("./src/app");
const pool = require("./src/config/db");
const logger = require("./src/utils/logger");
require("dotenv").config();

const rawPort = process.env.PORT || "5000";

const isValidDecimal = /^\d+$/.test(rawPort);
const portNumber = Number.parseInt(rawPort, 10);

if (!isValidDecimal || portNumber < 1 || portNumber > 65535) {
  const errorMessage = `CRITICAL CONFIG ERROR: Invalid PORT '${rawPort}'. Port must be a decimal integer between 1 and 65535.`;
  logger.error(errorMessage);
  process.exit(1);
}

const startServer = async () => {
  try {
    await pool.testDbConnection();

    app.listen(portNumber, () => {
      logger.info(`🚀 Server listening dynamically on port ${portNumber}`);
    });
  } catch (err) {
    logger.error(
      `CRITICAL STARTUP ERROR: Database connection failed: ${err.message}`,
    );
    process.exit(1);
  }
};

startServer();
