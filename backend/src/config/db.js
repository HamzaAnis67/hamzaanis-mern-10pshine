const mysql = require("mysql2/promise");
const logger = require("../utils/logger");
require("dotenv").config();

// 1. Required environment variables list
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

// 2. Fail fast if any required variables are missing
if (missingEnvVars.length > 0) {
  const errorMessage = `CRITICAL CONFIG ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// 3. Create pool using strictly validated values (DB_PASSWORD can be empty locally, so we handle it gracefully)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "", // empty string fallback only for local passwords
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    logger.info("Connected to MySQL Database via Pool successfully");
    connection.release();
  } catch (err) {
    logger.error(`Database connection pool failed: ${err.message}`);
  }
})();

module.exports = pool;
