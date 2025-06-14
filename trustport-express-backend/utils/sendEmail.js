// utils/sendEmail.js
const nodemailer = require('nodemailer');

module.exports = async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});
async function sendEmail({ to, subject, text, attachments }) {
  await transporter.sendMail({
    from: `"TrustPort Express" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    attachments,
  });
}

module.exports = sendEmail;

