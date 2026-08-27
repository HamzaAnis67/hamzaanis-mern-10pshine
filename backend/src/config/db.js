const mysql = require("mysql2/promise");
const logger = require("../utils/logger");
require("dotenv").config();

const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
];

const missingEnvVars = requiredEnvVars.filter((varName) => {
  const value = process.env[varName];
  return (
    value === undefined || (varName !== "DB_PASSWORD" && value.trim() === "")
  );
});

if (missingEnvVars.length > 0) {
  const errorMessage = `CRITICAL CONFIG ERROR: Missing or blank required environment variables: ${missingEnvVars.join(", ")}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

const dbPassword = process.env.DB_PASSWORD;
const isProduction = process.env.NODE_ENV === "production";

if (dbPassword.trim() === "" && isProduction) {
  const errorMessage =
    "CRITICAL SECURITY ERROR: Blank database passwords are not allowed in production.";
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 100,
});

pool.testDbConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    logger.info("Connected to MySQL Database via Pool successfully");
  } catch (error) {
    logger.error(`Database connection test failed: ${error.message}`);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = pool;
