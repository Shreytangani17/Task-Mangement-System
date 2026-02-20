require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    let admin;
    if (existingAdmin) {
      console.log('Admin user already exists');
      admin = existingAdmin;
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('123', 10);
      admin = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created successfully');
      console.log('Email: admin@gmail.com');
      console.log('Password: 123');
    }
    
    // Create sample employees
    const employees = [
      { name: 'Shreya', email: 'shreya@taskflow.com' },
      { name: 'John Doe', email: 'john@taskflow.com' },
      { name: 'Jane Smith', email: 'jane@taskflow.com' }
    ];

    for (const emp of employees) {
      const existing = await User.findOne({ email: emp.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash('employee123', 10);
        const employee = new User({
          name: emp.name,
          email: emp.email,
          password: hashedPassword,
          role: 'employee'
        });
        await employee.save();
        console.log(`Created employee: ${emp.email}`);
      } else {
        console.log(`Employee already exists: ${emp.email}`);
      }
    }

    console.log('\nAll users ready. Default password: employee123');

    // Create sample unassigned task
    const existingTask = await Task.findOne({ title: 'Complete Project Documentation' });
    if (!existingTask) {
      const sampleTask = new Task({
        title: 'Complete Project Documentation',
        description: 'Write comprehensive documentation for the task management system including setup guide and API documentation',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: admin._id,
        statusHistory: [{ status: 'Pending', changedBy: admin._id }]
      });
      await sampleTask.save();
      console.log('\nSample task created: "Complete Project Documentation" (Unassigned)');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin();
