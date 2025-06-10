const express = require('express');
const router = express.Router();
const ContactForm = require('../models/ContactForm');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new ContactForm({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit contact form.' });
  }
});

router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const contacts = await ContactForm.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve contact forms.' });
  }
});

router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const contact = await ContactForm.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact form not found.' });
    res.json({ message: 'Status updated.', contact });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update contact form status.' });
  }
});

module.exports = router;
