const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ email: 'admin@gmail.com' });
  console.log('Admin:', admin);
  await mongoose.connection.close();
};

checkAdmin();
