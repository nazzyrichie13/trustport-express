const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingCode: { type: String, required: true, unique: true },
  recipientName: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rescheduleRequested: { type: Boolean, default: false },
  rescheduleDate: { type: Date, default: null },
  rescheduleNotes: { type: String, default: '' },
});

module.exports = mongoose.model('Shipment', shipmentSchema)