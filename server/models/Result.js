const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  grade: String,
  points: Number,

  semester: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },

  // ✅ APPROVAL SYSTEM
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date

}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);