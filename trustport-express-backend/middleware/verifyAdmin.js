// middleware/verifyAdmin.js

module.exports = (req, res, next) => {
  // Example: check for an "admin" role on req.user
  if (req.user && req.user.role === 'admin') {
    return next(); // allow access
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
const verifyToken = require('./verifyToken');

module.exports = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Admins only' });
    }
  });
};

