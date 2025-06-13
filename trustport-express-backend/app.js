const dotenv = require('dotenv');
dotenv.config();


const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const adminAuthRoute = require('./routes/adminAuth');
const adminRoutes = require('./routes/admin');




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


module.exports = socketHandler;

// Server listen
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
console.log('MongoDB URI:', process.env.MONGODB_URI);
