require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const addUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Delete existing user if exists
    await User.deleteOne({ email: 'shreyaadmin@gmail.com' });
    await User.deleteOne({ email: 'shreyaemploy@gmail.com' });
    
    // Create admin user
    const hashedPasswordAdmin = await bcrypt.hash('123456', 10);
    const admin = new User({
      name: 'shreya',
      email: 'shreyaadmin@gmail.com',
      password: hashedPasswordAdmin,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created: shreyaadmin@gmail.com / 123456');

    // Create employee user
    const hashedPasswordEmployee = await bcrypt.hash('123456', 10);
    const employee = new User({
      name: 'shreya',
      email: 'shreyaemploy@gmail.com',
      password: hashedPasswordEmployee,
      role: 'employee'
    });
    await employee.save();
    console.log('Employee created: shreyaemploy@gmail.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addUser();
