const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());

// 🩺 Health Check Route
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    logger.info("Health check passed successfully");
    res.status(200).json({ status: "UP", server: "Running" });
  } catch (err) {
    logger.error(`Health check dependency failed: ${err.stack}`); // Keeps diagnostics in server logs
    res
      .status(500)
      .json({ status: "DOWN", message: "Service temporarily unavailable" }); // Hides raw database error
  }
});

app.use("/api/auth", authRoutes);

module.exports = app;
