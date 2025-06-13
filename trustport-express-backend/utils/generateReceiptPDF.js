const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceiptPDF = (receipt) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../receipts/${receipt.receiptId}.pdf`);

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('TrustPort Express - Shipment Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Receipt ID: ${receipt.receiptId}`);
    doc.text(`Tracking Code: ${receipt.trackingCode}`);
    doc.text(`Sender: ${receipt.senderName}`);
    doc.text(`Recipient: ${receipt.recipientName}`);
    doc.text(`Email: ${receipt.email}`);
    doc.text(`Address: ${receipt.address}`);
    doc.text(`Status: ${receipt.status}`);
    doc.text(`Type: ${receipt.shipmentType}`);
    doc.text(`Weight: ${receipt.packageWeight} kg`);
    doc.text(`Description: ${receipt.packageDescription}`);
    doc.text(`Pickup Date: ${new Date(receipt.pickupDate).toDateString()}`);
    doc.text(`Expected Delivery: ${new Date(receipt.expectedDeliveryDate).toDateString()}`);
    doc.text(`Current Location: ${receipt.currentLocation}`);
    doc.text(`Issued On: ${new Date(receipt.createdAt).toDateString()}`);

    doc.end();

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
};

module.exports = generateReceiptPDF;
