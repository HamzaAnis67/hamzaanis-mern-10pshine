const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @typedef {import('mysql2/promise').RowDataPacket} RowDataPacket
 * @typedef {import('mysql2/promise').ResultSetHeader} ResultSetHeader
 */

// 📝 SIGN UP
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. SELECT Query returning an array of RowDataPacket (has .length)
    const [existingUsers] = /** @type {[RowDataPacket[], any]} */ (
      await pool.query(
        "SELECT id FROM user_credentials WHERE email = ? OR username = ?",
        [email, username],
      )
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. INSERT Query returning a ResultSetHeader (has .insertId)
    const [result] = /** @type {[ResultSetHeader, any]} */ (
      await pool.query(
        "INSERT INTO user_credentials (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, passwordHash],
      )
    );

    res.status(201).json({
      message: "User registered successfully!",
      userId: result.insertId,
    });
  } catch (error) {
    // Catch race-condition duplicate key errors
    // @ts-ignore
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }
    next(error);
  }
};

// 🔐 SIGN IN
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 3. SELECT Query returning an array of RowDataPacket (has .length)
    const [users] = /** @type {[RowDataPacket[], any]} */ (
      await pool.query(
        "SELECT id, username, email, password_hash FROM user_credentials WHERE email = ?",
        [email],
      )
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin };
