const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: String,
  title: String,
  unit: Number,
  dept: String
});

module.exports = mongoose.model('Course', courseSchema);