require('dotenv').config();
const { sendTaskAssignmentEmail } = require('./utils/emailService');

// Test email sending
const testEmail = async () => {
  console.log('Testing email with credentials:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
  
  try {
    await sendTaskAssignmentEmail(
      'rshreya085@gmail.com',
      'Test User',
      'Test Task Assignment',
      'This is a test task to verify email notifications are working.',
      new Date()
    );
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
  }
};

testEmail();
