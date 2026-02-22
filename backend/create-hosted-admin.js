require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema (inline to avoid import issues)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const createHostedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to hosted MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists on hosted DB');
      console.log('Email: admin@gmail.com');
      console.log('Password: 123');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created on hosted DB');
    console.log('Email: admin@gmail.com');
    console.log('Password: 123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createHostedAdmin();