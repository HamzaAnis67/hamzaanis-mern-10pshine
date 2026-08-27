const pool = require("../config/db");
const logger = require("../utils/logger");

const createNote = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || content === undefined) {
    return res
      .status(400)
      .json({ error: "Title and content fields are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [userId, title, content],
    );

    logger.info(
      `Note created successfully: Note ID ${result.insertId} by User ID ${userId}`,
    );
    res
      .status(201)
      .json({ message: "Note created successfully", noteId: result.insertId });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [notes] = await pool.query(
      "SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
      [userId],
    );
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || content === undefined) {
    return res
      .status(400)
      .json({ error: "Title and content fields are required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [title, content, id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    logger.info(`Note updated: Note ID ${id} by User ID ${userId}`);
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    logger.info(`Note deleted: Note ID ${id} by User ID ${userId}`);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
