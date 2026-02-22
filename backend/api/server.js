require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const taskRoutes = require('../routes/tasks');
const commentRoutes = require('../routes/comments');
const attachmentRoutes = require('../routes/attachments');
const notificationRoutes = require('../routes/notifications');
const courierRoutes = require('../routes/courier');
const taskEntryRoutes = require('../routes/taskEntries');
const noteRoutes = require('../routes/notes');
const employeeMasterRoutes = require('../routes/employeeMaster');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    throw error;
  }
};

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API', status: 'running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// DB middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
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

module.exports = app;