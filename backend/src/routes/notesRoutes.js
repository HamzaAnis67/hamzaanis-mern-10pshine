const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getSingleNote,
} = require("../controllers/notesController");
const verifyToken = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getSingleNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
