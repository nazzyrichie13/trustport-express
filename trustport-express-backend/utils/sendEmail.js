module.exports = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token || token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(403).json({ message: 'Unauthorized admin access' });
  }
  next();
};

// ------------------------- utils/sendEmail.js -------------------------
const nodemailer = require('nodemailer');
module
module.exports = async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};