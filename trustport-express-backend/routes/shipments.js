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
      expectedDeliveryDate,
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



// Update shipment by tracking code
// Get a shipment by tracking code
router.get('/:trackingCode', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingCode: req.params.trackingCode });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a shipment
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

const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

router.get('/receipt/pdf/:trackingCode', verifyAdmin, async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingCode: req.params.trackingCode });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const doc = new PDFDocument({ margin: 40 });
    const stream = Readable.from(doc);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${shipment.trackingCode}.pdf`);

    // Header
    doc
      .fontSize(20)
      .fillColor('#007BFF')
      .text('TrustPort Express', { align: 'center' })
      .moveDown(0.5)
      .fontSize(16)
      .fillColor('black')
      .text('Shipment Receipt', { align: 'center' })
      .moveDown(1);

    // Divider
    doc
      .strokeColor('#888')
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(570, doc.y)
      .stroke()
      .moveDown();

    // Details
    doc.fontSize(12).fillColor('black');

    const lines = [
      ['Tracking Code:', shipment.trackingCode],
      ['Sender:', `${shipment.senderName} (${shipment.senderPhone})`],
      ['Recipient:', `${shipment.recipientName} (${shipment.recipientPhone})`],
      ['Email:', shipment.email],
      ['Address:', shipment.address],
      ['Status:', shipment.status],
      ['Shipment Type:', shipment.shipmentType],
      ['Package Weight:', `${shipment.packageWeight} kg`],
      ['Package Description:', shipment.packageDescription],
      ['Pickup Date:', new Date(shipment.pickupDate).toLocaleDateString()],
      ['Expected Delivery:', new Date(shipment.expectedDelivery).toLocaleDateString()],
      ['Current Location:', shipment.currentLocation],
      ['Created At:', new Date(shipment.createdAt).toLocaleString()],
    ];

    lines.forEach(([label, value]) => {
      doc
        .font('Helvetica-Bold').text(label, { continued: true })
        .font('Helvetica').text(` ${value}`)
        .moveDown(0.5);
    });

    doc.end();
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});





module.exports = router;