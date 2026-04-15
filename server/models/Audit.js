const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: String,
  action: String,
  route: String,
  method: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Audit', auditSchema);