const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Course = require('../models/Course');
const Result = require('../models/Result');

router.get('/', async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const courses = await Course.countDocuments();
    const results = await Result.countDocuments();

    res.json({
      students,
      courses,
      results,
      status: "online"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;