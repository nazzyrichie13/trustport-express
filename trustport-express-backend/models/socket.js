const sendEmail = require('./utils/mailer');

socket.on('admin reply', async ({ recipient, message }) => {
  const newMsg = new ChatMessage({
    sender: 'admin',
    recipient,
    message,
    isRead: false
  });
  await newMsg.save();
  io.to(recipient).emit('message', newMsg);

  // Optional: Fetch user's email from DB if `recipient` is an ID
  const userEmail = recipient; // replace with actual lookup if needed
  await sendEmail(userEmail, 'New message from TrustPort Admin', message);
});
