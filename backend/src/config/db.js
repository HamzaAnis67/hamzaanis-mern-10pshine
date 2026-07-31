const mysql = require("mysql2/promise");
const logger = require("../utils/logger");
require("dotenv").config();

// 1. Required environment variables list
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

// FIXED: Differentiate between undefined variables and explicitly empty strings
const missingEnvVars = requiredEnvVars.filter((varName) => {
  const value = process.env[varName];
  return value === undefined || (varName !== "DB_PASSWORD" && value === "");
});

// 2. Fail fast if variables are completely missing from the environment
if (missingEnvVars.length > 0) {
  const errorMessage = `CRITICAL CONFIG ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// 3. Security Check: Block empty passwords in production deployment environments
const dbPassword = process.env.DB_PASSWORD;
const isProduction = process.env.NODE_ENV === "production";

if (dbPassword === "" && isProduction) {
  const errorMessage =
    "CRITICAL SECURITY ERROR: Blank database passwords are not allowed in production.";
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// 4. Create pool using strictly validated values
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 100,
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
