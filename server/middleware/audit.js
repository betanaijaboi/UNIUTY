const Audit = require('../models/Audit');

const auditLog = (req, res, next) => {
  try {
    Audit.create({
      user: req.user ? req.user.id : "anonymous",
      action: "API Request",
      route: req.originalUrl,
      method: req.method
    }).catch(err => {
      console.log("Audit error:", err.message);
    });
  } catch (err) {
    console.log("Audit crash:", err.message);
  }

  next(); // ✅ NEVER BREAK CHAIN
};

module.exports = { auditLog };