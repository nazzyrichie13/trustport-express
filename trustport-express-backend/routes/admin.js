const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const sendReceiptEmail = require('../utils/sendReceiptEmail');
const generateReceiptPDF = require('../utils/generateReceiptPDF');

router.post('/create-shipment', async (req, res) => {
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

  try {
    const trackingCode = `TPX${Date.now().toString().slice(-6)}`;

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

    const receipt = {
      receiptId: `R-${trackingCode}`,
      trackingCode,
      senderName,
      recipientName,
      email,
      status,
      shipmentType,
      packageWeight,
      packageDescription,
      pickupDate,
      expectedDeliveryDate,
      address,
      currentLocation,
      createdAt: shipment.createdAt
    };

    const pdfPath = await generateReceiptPDF(receipt);

    await sendReceiptEmail(email, receipt, pdfPath);

    res.status(201).json({ message: 'Shipment created and receipt sent.', trackingCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

module.exports = router;
