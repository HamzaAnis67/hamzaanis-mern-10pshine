const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());

// 🩺 Health Check Route
app.get("/health", async (req, res) => {
  let connection;
  let timeoutId;

  // Create a promise that rejects after 2 seconds
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      if (connection) {
        logger.warn(
          "Health check timed out. Hard destroying database connection.",
        );
        connection.destroy(); // Physically close TCP socket to stop the query on MySQL server
      }
      reject(new Error("Database timeout exceeded"));
    }, 2000);
  });

  try {
    // Acquire a specific connection from the pool
    connection = await pool.getConnection();

    // Race the query execution against our hard timeout
    await Promise.race([connection.query("SELECT 1"), timeoutPromise]);

    logger.info("Health check passed successfully");
    res.status(200).json({ status: "UP", server: "Running" });
  } catch (err) {
    logger.error(`Health check dependency failed: ${err.message}`);
    res
      .status(500)
      .json({ status: "DOWN", message: "Service temporarily unavailable" });
  } finally {
    clearTimeout(timeoutId);
    // Only release back to pool if it wasn't destroyed
    if (connection && connection.connection._fatalError === null) {
      connection.release();
    }
  }
});

app.use("/api/auth", authRoutes);

module.exports = app;
