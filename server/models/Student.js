const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  matricNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    default: 0
  },
  feesPaid: {
    type: Boolean,
    default: false
  },
  biometricRegistered: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);