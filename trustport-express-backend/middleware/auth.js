// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Check if role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Invalid admin token' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyAdminToken;
