const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/tracking', require('./routes/tracking'));
app.use('/api/chat', require('./routes/chat'));

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Server listen
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));