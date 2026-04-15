const express = require('express');
const router = express.Router();

const Faculty = require('../models/Faculty');

// ➕ CREATE FACULTY
router.post('/', async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();

    res.json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 GET ALL FACULTY
router.get('/', async (req, res) => {
  const faculty = await Faculty.find();
  res.json(faculty);
});

module.exports = router;