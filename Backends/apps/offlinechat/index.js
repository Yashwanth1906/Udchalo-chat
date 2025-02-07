const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});
const PORT = 4000;

app.use(cors());

app.get('/api', (req, res) => {
  res.json({ message: 'Chat server is running' });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('joinRoom', (room) => {
    console.log(`Socket ${socket.id} joining room ${room}`);
    socket.join(room);
  });
  socket.on('chatMessage', ({ message, room }) => {
    console.log(`Message from ${socket.id} in room ${room}:, message`);
    if (room) {
      io.to(room).emit('chatMessage', message);
    }
  });
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
http.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.io server is running on http://0.0.0.0:${PORT}`);
});