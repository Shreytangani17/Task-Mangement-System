const nodemailer = require('nodemailer');

// Configure SMTP with explicit timeouts so a slow/unreachable Gmail never
// hangs the whole server. Each phase times out in 3 seconds max.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  connectionTimeout: 3000, // 3s to establish TCP connection
  greetingTimeout: 3000,   // 3s for SMTP greeting
  socketTimeout: 5000,     // 5s for each socket operation
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendTaskAssignmentEmail = async (employeeEmail, employeeName, taskTitle, taskDescription, dueDate) => {
  try {
    const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString() : 'Not set';
    const info = await transporter.sendMail({
      from: `"Task Management System" <${process.env.EMAIL_USER}>`,
      to: employeeEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <h2>Hello ${employeeName},</h2>
        <p>You have been assigned a new task:</p>
        <h3>${taskTitle}</h3>
        <p><strong>Description:</strong> ${taskDescription}</p>
        <p><strong>Due Date:</strong> ${dueDateStr}</p>
        <p>Please log in to the Task Management System to view more details.</p>
        <br>
        <p>Best regards,<br>Task Management System</p>
      `
    });
    console.log('✅ Email sent to:', employeeEmail, '| ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error for:', employeeEmail, '|', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendTaskAssignmentEmail };
