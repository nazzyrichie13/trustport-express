// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter once on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

/**
 * Send an email with optional attachments.
 */
async function sendEmail({ to, subject, text, attachments = [] }) {
  try {
    const info = await transporter.sendMail({
      from: `"TrustPort Express" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}

/**
 * Simple email (no attachments)
 */
async function sendEmailNotification(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: '"TrustPort Admin" <no-reply@trustport.com>',
      to,
      subject,
      text,
    });

    console.log("✅ Notification email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send notification:", error.message);
  }
}

// ✅ Correctly export both
module.exports = {
  sendEmail,
  sendEmailNotification,
};
