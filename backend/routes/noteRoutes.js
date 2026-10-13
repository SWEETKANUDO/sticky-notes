const express = require("express");
const Note = require("../models/notes");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Sabhi routes par login required
router.use(authMiddleware);

// GET: Current user ke notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Naya note
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      description: description || "",
      isPinned: false,
      isFavorite: false,
      user: req.userId,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// PUT: Apna note update karo
router.put("/:id", async (req, res) => {
  try {
    const { title, description, isPinned, isFavorite } = req.body;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) {
      updateData.description = description;
    }
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isFavorite !== undefined) {
      updateData.isFavorite = isFavorite;
    }

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE: Apna note delete karo
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Could not delete note" });
  }
});

module.exports = router;
