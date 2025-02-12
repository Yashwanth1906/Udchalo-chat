const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 2000;
app.use(cors());
app.use(express.json());

let messageHistory = []; // Stores messages temporarily (use DB in production)

app.get("/api", (req, res) => {
  res.json({ message: "Chat server is running" });
});

app.post("/api/user/syncmessages", (req, res) => {
  const { messagesArray } = req.body;
  if (!messagesArray || !Array.isArray(messagesArray)) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  messageHistory = [...messageHistory, ...messagesArray]; // Store messages
  console.log("Synced messages:", messagesArray);
  res.json({ success: true });
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
    socket.emit("previousMessages", messageHistory); // Send past messages only to the joining socket
  });

  socket.on("chatMessage", ({ message, room }) => {
    console.log(`Message received in ${room}:`, message);
    messageHistory.push(message);
    socket.to(room).emit("chatMessage", message); // Send message to everyone EXCEPT sender
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
