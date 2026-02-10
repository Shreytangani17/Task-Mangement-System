require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');

    const users = await User.find().select('-password');
    console.log('\nExisting users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log(`\nTotal users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
