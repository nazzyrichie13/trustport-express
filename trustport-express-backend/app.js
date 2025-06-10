const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const shipmentRoutes = require('./routes/shipments');
const contactRoutes = require('./routes/contact');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/shipments', shipmentRoutes);
app.use('/api/contact', contactRoutes);


app.use('/api/tracking', require('./routes/tracking'));
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);







const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server);

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // broadcast message to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
