require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const addShreya = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: 'shreya@taskflow.com' });
    if (existing) {
      console.log('Shreya already exists');
      process.exit(0);
    }

    const password = await bcrypt.hash('employee123', 10);
    const shreya = new User({
      name: 'Shreya',
      email: 'shreya@taskflow.com',
      password: password,
      role: 'employee'
    });
    await shreya.save();

    console.log('Shreya created successfully!');
    console.log('Email: shreya@taskflow.com');
    console.log('Password: employee123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addShreya();
