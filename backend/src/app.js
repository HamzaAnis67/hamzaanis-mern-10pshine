const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger");
const notesRoutes = require("./routes/notesRoutes");
const httpLogger = require("./middlewares/loggerMiddleware");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.disable("x-powered-by");

app.use(httpLogger);

app.use(express.json());

app.get("/health", async (req, res) => {
  let connection;
  let timeoutId;
  let timedOut = false;

  const acquireConnection = pool.getConnection().then((conn) => {
    if (timedOut) {
      logger.warn(
        "Late database connection acquired after timeout. Hard destroying socket.",
      );
      conn.destroy();
      return null;
    }
    return conn;
  });

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      timedOut = true;
      reject(new Error("Database timeout exceeded"));
    }, 2000);
  });

  timeoutPromise.catch(() => {});

  try {
    connection = await Promise.race([acquireConnection, timeoutPromise]);

    if (!connection) {
      throw new Error("Database timeout exceeded");
    }

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

    if (connection && !timedOut) {
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
