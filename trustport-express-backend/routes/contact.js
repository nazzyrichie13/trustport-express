
  const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await sendEmail(
      'support@trustportexpress.com',
      `New Contact Form Message: ${subject}`,
      `From: ${name} <${email}>\n\nMessage:\n${message}`
    );
    res.json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
