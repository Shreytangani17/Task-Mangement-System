const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'rshreya085@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User NOT found with email:', email);
      console.log('\nAll users in database:');
      const allUsers = await User.find({}, 'name email role');
      console.log(allUsers);
    } else {
      console.log('✅ User found!');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Password hash:', user.password);

      // Test password
      const testPassword = 'employee123';
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log('\nPassword "employee123" matches:', isMatch ? '✅ YES' : '❌ NO');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUser();
