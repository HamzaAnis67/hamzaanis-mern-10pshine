const mysql = require("mysql2/promise");
const logger = require("../utils/logger");
require("dotenv").config();

// 1. Required environment variables list
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

if (dbPassword === "" && isProduction) {
  const errorMessage =
    "CRITICAL SECURITY ERROR: Blank database passwords are not allowed in production.";
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

/**
 * Extend MySQL Pool type definition to include custom testDbConnection method
 * @typedef {import('mysql2/promise').Pool & { testDbConnection: () => Promise<void> }} CustomPool
 */

/** @type {CustomPool} */
// @ts-ignore
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 100,
});

// 2. Attach custom connection test method
pool.testDbConnection = async () => {
  const connection = await pool.getConnection();
  logger.info("Connected to MySQL Database via Pool successfully");
  connection.release();
};

module.exports = pool;
