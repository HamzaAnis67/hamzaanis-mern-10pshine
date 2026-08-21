const express = require("express");
const pool = require("./config/db");
const logger = require("./utils/logger");
const httpLogger = require("./middlewares/loggerMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

app.disable("x-powered-by");

app.use(httpLogger);
app.use(express.json());

app.get("/health", async (req, res) => {
  let connection;
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    if (connection) {
      connection.destroy();
    }
    if (!res.headersSent) {
      res.status(503).json({
        status: "DOWN",
        error: "Database health check timed out",
      });
    }
  }, 3000);

  try {
    connection = await pool.getConnection();

    if (timedOut) {
      connection.destroy();
      return;
    }

    await connection.query("SELECT 1");

    clearTimeout(timeoutId);

    if (timedOut) {
      connection.destroy();
    } else {
      connection.release();
      res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    clearTimeout(timeoutId);

    if (connection) {
      if (timedOut) {
        connection.destroy();
      } else {
        connection.release();
      }
    }

    if (!res.headersSent) {
      logger.error(`Health check dependency failed: ${err.message}`);
      res.status(503).json({
        status: "DOWN",
        error: "Database health check failed",
      });
    }
  }
});

app.get("/test-error", (req, res, next) => {
  const error = new Error("This is a simulated test error");
  next(error);
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorHandler);

module.exports = app;
