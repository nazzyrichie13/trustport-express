const PDFDocument = require('pdfkit');

function generatePDF({ title, shipment }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.fontSize(18).text(title, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Tracking Code: ${shipment.trackingCode}`);
    doc.text(`Recipient Name: ${shipment.recipient.name}`);
    doc.text(`New Delivery Address: ${shipment.recipient.address}`);
    doc.text(`New Estimated Delivery: ${shipment.estimatedDelivery}`);
    doc.text(`Status: ${shipment.status}`);

    doc.end();
  });
}

module.exports = generatePDF;
