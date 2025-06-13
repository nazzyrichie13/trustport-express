const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingCode: {
    type: String,
    required: true,
    unique: true
  },
  senderName: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  senderPhone: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Delayed'],
    default: 'Pending'
  },
  shipmentType: {
    type: String,
    enum: ['Standard', 'Express', 'Overnight'],
    required: true
  },
  packageWeight: {
    type: Number,
    required: true
  },
  packageDescription: {
    type: String,
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  expectedDeliveryDate: {
    type: Date,
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  }
}, { timestamps: true });
 

module.exports = mongoose.model('Shipment', shipmentSchema);
