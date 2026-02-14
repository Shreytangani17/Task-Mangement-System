const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const sendTaskAssignmentEmail = async (employeeEmail, employeeName, taskTitle, taskDescription, dueDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Task Management System',
      to: employeeEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <h2>Hello ${employeeName},</h2>
        <p>You have been assigned a new task:</p>
        <h3>${taskTitle}</h3>
        <p><strong>Description:</strong> ${taskDescription}</p>
        <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        <p>Please log in to the Task Management System to view more details.</p>
        <br>
        <p>Best regards,<br>Task Management System</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', employeeEmail);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = { sendTaskAssignmentEmail };
