const nodemailer = require('nodemailer');

const sendReceiptEmail = async (to, receipt, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"TrustPort Express" <no-reply@trustport.com>',
    to,
    subject: `Shipment Receipt - ${receipt.trackingCode}`,
    html: `
      <h3>Shipment Receipt - ${receipt.receiptId}</h3>
      <p><strong>Sender:</strong> ${receipt.senderName}</p>
      <p><strong>Recipient:</strong> ${receipt.recipientName}</p>
      <p><strong>Status:</strong> ${receipt.status}</p>
      <p><strong>Package:</strong> ${receipt.packageDescription} (${receipt.packageWeight} kg)</p>
      <p><strong>Pickup Date:</strong> ${new Date(receipt.pickupDate).toDateString()}</p>
      <p><strong>Expected Delivery:</strong> ${new Date(receipt.expectedDeliveryDate).toDateString()}</p>
      <p><strong>Location:</strong> ${receipt.currentLocation}</p>
    `,
    attachments: [{ filename: 'receipt.pdf', path: pdfPath }],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendReceiptEmail;
