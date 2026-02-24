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

// ─── MongoDB: persistent connection across Vercel serverless invocations ──────
// Uses global to reuse the connection even when the module is re-evaluated.
// This is the official Vercel + Mongoose recommended pattern.
if (!global._mongooseConnection) {
  global._mongooseConnection = { conn: null, promise: null };
}
const cached = global._mongooseConnection;

const connectDB = async () => {
  // Already connected — return immediately (fastest path)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  // Connection in-flight — await the existing promise (avoids double connect)
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }
  mongoose.set('bufferCommands', false); // fail fast — don't queue ops during connect
  cached.promise = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 4000, // 4s max wait to pick a server
    socketTimeoutMS: 8000,
    connectTimeoutMS: 4000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
  }).then((m) => {
    console.log('✅ MongoDB connected');
    return m;
  }).catch((err) => {
    cached.promise = null; // Reset so next request retries
    console.error('❌ MongoDB error:', err.message);
    throw err;
  });
  cached.conn = await cached.promise;
  return cached.conn;
};

// Connect immediately when the module loads
connectDB().catch(console.error);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health / keep-alive endpoint (call this every 5 min to prevent cold starts)
app.get('/', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ message: 'Task Management API', status: 'running', db: isConnected ? 'connected' : 'disconnected' });
});

app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ status: 'ok', db: isConnected ? 'connected' : 'disconnected' });
});

// DB guard middleware — runs connectDB if not yet connected (serverless safety)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
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
