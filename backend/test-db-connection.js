require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Short timeout for testing
})
.then(() => {
  console.log('SUCCESS: Connected to MongoDB!');
  process.exit(0);
})
.catch(err => {
  console.error('ERROR: Could not connect to MongoDB');
  console.error(err.name);
  console.error(err.message);
  console.error('Full Error:', err);
  process.exit(1);
});
