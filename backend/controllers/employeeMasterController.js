const EmployeeMaster = require('../models/EmployeeMaster');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, department, designation, joiningDate } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create User account with default password
    const defaultPassword = 'employee123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'employee'
    });
    await user.save();
    console.log('User created:', user._id, user.email);
    
    // Create EmployeeMaster record
    const employee = new EmployeeMaster({ 
      name, 
      email, 
      phone, 
      department, 
      designation, 
      joiningDate,
      userId: user._id,
      createdBy: req.user._id 
    });
    await employee.save();
    console.log('Employee created:', employee._id);
    
    res.status(201).json({ 
      employee, 
      message: `Employee created successfully! Login credentials - Email: ${email}, Password: employee123` 
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const employees = await EmployeeMaster.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const employee = await EmployeeMaster.findById(req.params.id);
    if (employee && employee.userId) {
      await User.findByIdAndDelete(employee.userId);
    }
    await EmployeeMaster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
