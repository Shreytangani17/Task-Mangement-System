require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const attachmentRoutes = require('./routes/attachments');
const notificationRoutes = require('./routes/notifications');
const courierRoutes = require('./routes/courier');
const taskEntryRoutes = require('./routes/taskEntries');
const noteRoutes = require('./routes/notes');
const employeeMasterRoutes = require('./routes/employeeMaster');

const app = express();

// Compression middleware
app.use(compression());

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now
    }
  },
  credentials: true,
}));

// Fix Chrome's Private Network Access policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache uploads for 1 day
}));

// ─── MongoDB: connect eagerly once at startup ─────────────────────────────────
let dbConnected = false;

const connectDB = async () => {
  if (dbConnected || mongoose.connection.readyState === 1) {
    dbConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // 5s — fail fast instead of 30s freeze
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    dbConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    dbConnected = false;
    throw error;
  }
};

// Connect immediately when the module loads (important for serverless warm-up)
connectDB().catch(console.error);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health / keep-alive endpoint (call this every 5 min to prevent cold starts)
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API', status: 'running', db: dbConnected ? 'connected' : 'disconnected' });
});

app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: 'ok', db: dbConnected ? 'connected' : 'disconnected' });
});

// DB guard middleware — only runs if not yet connected (rare race condition safety)
app.use(async (req, res, next) => {
  if (dbConnected) return next();
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('❌ DB middleware error:', error.message);
    res.status(503).json({ error: 'Database temporarily unavailable. Please retry in a moment.' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/task-entries', taskEntryRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/employee-master', employeeMasterRoutes);

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
