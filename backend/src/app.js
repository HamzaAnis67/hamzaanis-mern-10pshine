const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());

// Helper function to create a timeout promise
const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database timeout exceeded")), ms),
  );

// 🩺 Health Check Route
app.get("/health", async (req, res) => {
  try {
    // FIXED: Wrap the query in a Promise.race to fail fast if the database is unresponsive
    await Promise.race([
      pool.query("SELECT 1"),
      timeout(2000), // 2 seconds timeout threshold
    ]);

    logger.info("Health check passed successfully");
    res.status(200).json({ status: "UP", server: "Running" });
  } catch (err) {
    logger.error(`Health check dependency failed: ${err.message}`);
    res
      .status(500)
      .json({ status: "DOWN", message: "Service temporarily unavailable" });
  }
});

app.use("/api/auth", authRoutes);

module.exports = app;
