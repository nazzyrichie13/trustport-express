


const socket = io();

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = chatInput.value;
  socket.emit('chat message', msg);
  chatInput.value = '';
});

socket.on('chat message', (msg) => {
  const msgEl = document.createElement('div');
  msgEl.textContent = msg;
  chatMessages.appendChild(msgEl);
});
