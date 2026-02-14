const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'rshreya085@gmail.com';
    const newPassword = 'employee123';
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successfully!');
      console.log('Email:', email);
      console.log('New Password: employee123');
      
      // Verify
      const user = await User.findOne({ email });
      const isMatch = await bcrypt.compare(newPassword, user.password);
      console.log('Verification:', isMatch ? '✅ Password works!' : '❌ Still not working');
    } else {
      console.log('❌ User not found or password not updated');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

resetPassword();
