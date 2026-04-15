const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: String,
  department: String,
  title: String,
  courses: Number,
  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);