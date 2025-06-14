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
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email or array of emails
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email body (plain text)
 * @param {Array} [options.attachments] - Optional array of attachments
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

module.exports = sendEmail;
