const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const verifyToken = require("../middlewares/authMiddleware");

router.use(verifyToken); // Protect all notes routes

router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
