const express = require('express');
const router = express.Router();

const Result = require('../models/Result');
const { authenticate, authorize } = require('../middleware/auth');

// 🎯 GRADE CALCULATOR
function getGrade(score) {
  if (score >= 70) return { grade: 'A', points: 5 };
  if (score >= 60) return { grade: 'B', points: 4 };
  if (score >= 50) return { grade: 'C', points: 3 };
  if (score >= 45) return { grade: 'D', points: 2 };
  if (score >= 40) return { grade: 'E', points: 1 };
  return { grade: 'F', points: 0 };
}

// ➕ CREATE RESULT (LECTURER ONLY)
router.post('/', authenticate, authorize('lecturer', 'admin'), async (req, res) => {
  try {
    const { grade, points } = getGrade(req.body.score);

    const result = new Result({
      ...req.body,
      grade,
      points,
      status: 'pending'
    });

    await result.save();

    res.json(result);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📥 GET ALL RESULTS
router.get('/', authenticate, async (req, res) => {
  const results = await Result.find()
    .populate('student')
    .populate('course');

  res.json(results);
});

// ✅ APPROVE RESULT (ADMIN ONLY)
router.put('/:id/approve', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    result.status = 'approved';
    result.approvedBy = req.user.id;
    result.approvedAt = new Date();

    await result.save();

    res.json({
      message: 'Result approved',
      result
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ REJECT RESULT (ADMIN ONLY)
router.put('/:id/reject', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    result.status = 'rejected';

    await result.save();

    res.json({
      message: 'Result rejected',
      result
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;