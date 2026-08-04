const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");
const notesRoutes = require("./routes/notesRoutes");
const httpLogger = require("./middlewares/loggerMiddleware");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(httpLogger);

app.use(express.json());

// 🩺 Health Check Route
app.get("/health", async (req, res) => {
  let connection;
  let timeoutId;
  let wasDestroyed = false; // Explicitly track connection destruction state

  // 1. Define the timeout handler
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      wasDestroyed = true;
      if (connection) {
        logger.warn(
          "Health check timed out. Hard destroying database connection.",
        );
        connection.destroy(); // Physically close TCP socket if connection was already acquired
      }
      reject(new Error("Database timeout exceeded"));
    }, 2000);
  });

  // 2. Prevent UnhandledPromiseRejection if the pool stalls completely
  timeoutPromise.catch(() => {});

  try {
    // 3. Race the connection acquisition itself against the timeout
    connection = await Promise.race([pool.getConnection(), timeoutPromise]);

    // 4. Race the database query against the timeout
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

    // 5. Explicit safety check using our local flag to guarantee a dead connection never goes back to the pool
    if (connection && !wasDestroyed) {
      connection.release();
    }
  }
});

app.get("/test-error", (req, res, next) => {
  throw new Error("Simulated database failure or runtime crash!");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorHandler);

module.exports = app;
