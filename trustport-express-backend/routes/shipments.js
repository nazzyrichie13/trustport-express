// Add after the existing routes in shipments.js
const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const verifyAdmin = require('../middleware/verifyAdmin');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

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

    // Generate unique tracking code
    let trackingCode;
    let existing;
    do {
      trackingCode = generateTrackingCode();
      existing = await Shipment.findOne({ trackingCode });
    } while (existing);

    // Create shipment
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

    // Create PDF receipt
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // Send email with PDF attachment
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: `"TrustPort Express" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: `Your Shipment Receipt - ${trackingCode}`,
        text: `Your shipment has been created.\nTracking Code: ${trackingCode}`,
        attachments: [
          {
            filename: `receipt-${trackingCode}.pdf`,
            content: pdfData,
            contentType: 'application/pdf'
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: 'Shipment created and receipt emailed.', shipment });
    });

    // Build PDF content
    doc.fontSize(20).fillColor('#007BFF').text('TrustPort Express', { align: 'center' });
    doc.moveDown(0.5).fontSize(16).fillColor('black').text('Shipment Receipt', { align: 'center' }).moveDown(1);
    doc.strokeColor('#888').lineWidth(1).moveTo(40, doc.y).lineTo(570, doc.y).stroke().moveDown();

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
      ['Expected Delivery:', new Date(shipment.expectedDeliveryDate).toLocaleDateString()],
      ['Current Location:', shipment.currentLocation],
      ['Created At:', new Date(shipment.createdAt).toLocaleString()]
    ];

    lines.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, { continued: true }).font('Helvetica').text(` ${value}`).moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating shipment or sending email' });
  }
});
module.exports = router;