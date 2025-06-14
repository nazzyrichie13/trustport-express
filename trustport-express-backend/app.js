const dotenv = require('dotenv');
dotenv.config();


const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const adminAuthRoute = require('./routes/adminAuth');
const adminRoutes = require('./routes/admin');
const Shipment = require('./models/Shipment');

const { sendEmail, sendEmailNotification } = require('./utils/sendEmail');

const generatePDF = require('./utils/generatePDF'); // PDF utility
const fs = require('fs');





const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});




// Routes
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/contact', require('./routes/contact'));

app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', adminAuthRoute);
app.use('/admin', adminRoutes);


// WebSocket event handling
const ChatMessage = require('./models/ChatMessage');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', async (userId) => {
      socket.join(userId);
      
      // Send default message from admin
      const welcomeMessage = new ChatMessage({
        sender: 'admin',
        recipient: userId,
        message: 'Thanks for contacting TrustPort Admin!',
        isRead: true
      });
      await welcomeMessage.save();
      socket.emit('message', welcomeMessage);
    });

    socket.on('chat message', async ({ sender, recipient, message }) => {
      const newMsg = new ChatMessage({ sender, recipient, message });
      await newMsg.save();

      io.to(recipient).emit('message', newMsg);
    });

    socket.on('markAsRead', async ({ userId }) => {
      await ChatMessage.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    });
  });
}
app.get('/api/chat/:userId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: req.params.userId },
        { recipient: req.params.userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});
app.get('/api/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (err) {
    console.error('Error fetching shipments:', err.message);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});



app.post('/reschedule', async (req, res) => {
  try {
    const { trackingCode, newDeliveryDate, newDeliveryAddress, userEmail } = req.body;

    if (!trackingCode || (!newDeliveryDate && !newDeliveryAddress)) {
      return res.status(400).json({ message: 'Tracking code and at least one field (date or address) are required.' });
    }

    const shipment = await Shipment.findOne({ trackingCode });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    if (newDeliveryDate) shipment.estimatedDelivery = newDeliveryDate;
    if (newDeliveryAddress) shipment.recipient.address = newDeliveryAddress;

    shipment.status = 'Rescheduled';
    await shipment.save();

    // ✅ Generate PDF
    const pdfBuffer = await generatePDF({
      title: 'Rescheduled Shipment Receipt',
      shipment,
    });

    // ✅ Email to user
    await sendEmail({
      to: userEmail,
      subject: `Your shipment has been rescheduled (${trackingCode})`,
      text: `Hi ${shipment.recipient.name}, your shipment has been rescheduled.`,
      attachments: [{ filename: 'reschedule_receipt.pdf', content: pdfBuffer }],
    });

    // ✅ Notify Admin
    await sendEmail({
      to: 'youngnazzy13@gmail.com',
      subject: 'Shipment Rescheduled Notification',
      text: `Tracking code ${trackingCode} has been rescheduled by the user.`,
      attachments: [{ filename: 'reschedule_receipt.pdf', content: pdfBuffer }],
    });

    res.json({ message: 'Reschedule successful. Confirmation sent to your email.', shipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during reschedule' });
  }
});
// Update shipment (admin)
app.post('/admin/update-shipment', async (req, res)  => {
  try {
    const { trackingCode, status } = req.body;

    const shipment = await Shipment.findOne({ trackingCode });
    if (!shipment) {
      return res.status(404).send('Shipment not found');
    }

    shipment.status = status;
    await shipment.save();

    res.redirect('/admin/dashboard'); // Or wherever you want to go after update
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




module.exports = socketHandler;

// Server listen
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
console.log('MongoDB URI:', process.env.MONGODB_URI);
