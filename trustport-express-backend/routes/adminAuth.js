// routes/adminAuth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Admin login route
router.post('/login', (req, res) => {
  const { email, token } = req.body;

  // Compare with your .env values
  if (email === process.env.ADMIN_EMAIL && token === process.env.TOKEN) {
    const jwtToken = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ message: 'Login successful', token: jwtToken });
  }

  res.status(401).json({ message: 'Invalid email or token' });
});

module.exports = router;
