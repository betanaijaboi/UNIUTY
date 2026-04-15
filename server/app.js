require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');

// 🔐 Middleware
const { auditLog } = require('./middleware/audit');

const app = express();

// ✅ CONNECT DATABASE
connectDB();

// ✅ GLOBAL MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// ✅ Audit (safe now — you can enable)
app.use(auditLog);

// ✅ ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/results', require('./routes/results'));
app.use('/api/transcript', require('./routes/transcript'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ✅ HEALTH CHECK
app.get('/', (req, res) => {
  res.send('UNIUTY API running...');
});

// ❌ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);

  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});