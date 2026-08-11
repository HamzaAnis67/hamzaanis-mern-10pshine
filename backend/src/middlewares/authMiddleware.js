const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Invalid token attempt: ${error.message}`);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
