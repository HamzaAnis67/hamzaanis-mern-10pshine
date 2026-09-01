const pool = require("../config/db");
const logger = require("../utils/logger");

// Helper function to sanitize and validate numeric IDs
const parseSafeId = (id) => {
  const parsed = Number.parseInt(id, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const createNote = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = parseSafeId(req.user?.id);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized user session" });
  }

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    content === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Title and content fields are required" });
  }

  try {
    const cleanTitle = title.trim();
    const cleanContent =
      typeof content === "string" ? content : String(content);

    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [userId, cleanTitle, cleanContent],
    );

    const noteId = result.insertId;
    logger.info("Note created successfully", { noteId, userId });

    res.status(201).json({
      message: "Note created successfully",
      noteId,
    });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  const userId = parseSafeId(req.user?.id);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized user session" });
  }

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

const getSingleNote = async (req, res, next) => {
  const userId = parseSafeId(req.user?.id);
  const noteId = parseSafeId(req.params?.id);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized user session" });
  }

  if (!noteId) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  try {
    const [notes] = await pool.query(
      "SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? AND id = ?",
      [userId, noteId],
    );

    if (notes.length === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  const userId = parseSafeId(req.user?.id);
  const noteId = parseSafeId(req.params?.id);
  const { title, content } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized user session" });
  }

  if (!noteId) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    content === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Title and content fields are required" });
  }

  try {
    const cleanTitle = title.trim();
    const cleanContent =
      typeof content === "string" ? content : String(content);

    const [result] = await pool.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [cleanTitle, cleanContent, noteId, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    logger.info("Note updated successfully", { noteId, userId });
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  const userId = parseSafeId(req.user?.id);
  const noteId = parseSafeId(req.params?.id);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized user session" });
  }

  if (!noteId) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [noteId, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    logger.info("Note deleted successfully", { noteId, userId });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
