const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger"); // Import Pino Logger

// 📝 SIGN UP
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existingUsers] = await pool.query(
      "SELECT id FROM user_credentials WHERE email = ? OR username = ?",
      [email, username],
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      "INSERT INTO user_credentials (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash],
    );

    res.status(201).json({
      message: "User registered successfully!",
      userId: result.insertId,
    });
  } catch (error) {
    logger.error(`Signup Failed: ${error.stack}`); // Safe internal server log
    res.status(500).json({ error: "Internal server error" }); // Generic safe client response
  }
};

// 🔐 SIGN IN
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [users] = await pool.query(
      "SELECT * FROM user_credentials WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful!",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    logger.error(`Signin Failed: ${error.stack}`); // Safe internal server log
    res.status(500).json({ error: "Internal server error" }); // Generic safe client response
  }
};

module.exports = { signup, signin };
