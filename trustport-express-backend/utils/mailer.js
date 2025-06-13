const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmailNotification = async (to, subject, text) => {
  await transporter.sendMail({
    from: '"TrustPort Admin" <no-reply@trustport.com>',
    to,
    subject,
    text
  });
};

module.exports = sendEmailNotification;
