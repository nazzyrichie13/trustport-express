// Add after the existing routes in shipments.js

// User requests reschedule by tracking code
const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const verifyAdmin = require('../middleware/verifyAdmin');
const sendEmail = require('../utils/sendEmail');

router.post('/create', verifyAdmin, async (req, res) => {
  try {
    const { trackingCode, recipientName, address, email, status, location } = req.body;
    const shipment = new Shipment({ trackingCode, recipientName, address, email, status, location });
    await shipment.save();
    await sendEmail(email, 'Shipment Created', `Your tracking code is ${trackingCode}.`);
    res.status(201).json({ message: 'Shipment created', shipment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating shipment' });
  }
});

router.get('/:trackingCode', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingCode: req.params.trackingCode });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving shipment' });
  }
});

router.post('/reschedule/:trackingCode', async (req, res) => {
  try {
    const { rescheduleDate, rescheduleNotes } = req.body;
    const shipment = await Shipment.findOne({ trackingCode: req.params.trackingCode });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    shipment.rescheduleRequested = true;
    shipment.rescheduleDate = new Date(rescheduleDate);
    shipment.rescheduleNotes = rescheduleNotes || '';
    await shipment.save();
    res.json({ message: 'Reschedule request submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing reschedule request' });
  }
});

router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving shipments' });
  }
});

router.patch('/:trackingCode', verifyAdmin, async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { trackingCode: req.params.trackingCode },
      req.body,
      { new: true }
    );
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ message: 'Shipment updated', shipment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating shipment' });
  }
});

module.exports = router;
