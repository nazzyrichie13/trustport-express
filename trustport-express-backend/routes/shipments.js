// Add after the existing routes in shipments.js
const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const verifyAdmin = require('../middleware/verifyAdmin');
const sendEmail = require('../utils/sendEmail');

// Generate random tracking code
const generateTrackingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

router.post('/create', verifyAdmin, async (req, res) => {
  try {
    const {
      senderName,
      recipientName,
      senderPhone,
      recipientPhone,
      address,
      email,
      status,
      shipmentType,
      packageWeight,
      packageDescription,
      pickupDate,
      expectedDeliveryDate,
      currentLocation
    } = req.body;

    let trackingCode;
    let existing;

    // Keep generating a tracking code until it's unique
    do {
      trackingCode = generateTrackingCode();
      existing = await Shipment.findOne({ trackingCode });
    } while (existing);

    const shipment = new Shipment({
      trackingCode,
      senderName,
      recipientName,
      senderPhone,
      recipientPhone,
      address,
      email,
      status,
      shipmentType,
      packageWeight,
      packageDescription,
      pickupDate,
      expectedDelivery: expectedDeliveryDate,
      currentLocation
    });

    await shipment.save();

    await sendEmail(email, 'Shipment Created', `Your tracking code is ${trackingCode}.`);

    res.status(201).json({ message: 'Shipment created successfully', shipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating shipment' });
  }
});

// User requests reschedule by tracking code


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