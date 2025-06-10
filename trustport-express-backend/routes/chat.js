const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;

  // Dummy reply (replace with real-time logic or database)
  const adminReply = `Got your message: "${message}" — we'll respond shortly.`;

  res.json({ reply: adminReply });
});

module.exports = router;
