const express = require('express');
const router = express.Router();

const Faculty = require('../models/Faculty');
const { authenticate, authorize } = require('../middleware/auth');

// ➕ CREATE FACULTY (ADMIN ONLY)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();

    res.json({
      message: "Faculty created",
      faculty
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 GET ALL FACULTY
router.get('/', authenticate, async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 GET SINGLE FACULTY
router.get('/:id', authenticate, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE FACULTY (ADMIN)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);

    res.json({ message: "Faculty deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;