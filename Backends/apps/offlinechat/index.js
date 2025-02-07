// const express = require("express");
// const cors = require("cors");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const redis = require("../../../packages/db/redis/redisClient"); // Import Redis client

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

// const PORT = 2000;

// app.use(cors());
// app.use(express.json());

// const pendingMessages = [];

// app.post("/api/user/pushToQueue", async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message || !message.userId || !message.username || !message.content) {
//       return res.status(400).json({ error: "Invalid message format" });
//     }
//     message.type = "message";
//     if (redis.isReady) {
//       await redis.rPush("chatQueue", JSON.stringify(message));
//       return res.status(200).json({ success: true, message: "Message added to queue" });
//     } else {
//       pendingMessages.push(message);
//       console.log("Redis is unavailable, storing message locally.");
//       return res.status(503).json({ error: "Redis unavailable, message stored locally" });
//     }
//   } catch (error) {
//     console.error("Error pushing message:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// const flushPendingMessages = async () => {
//   if (pendingMessages.length > 0 && redis.isReady) {
//     console.log(`Flushing ${pendingMessages.length} pending messages to Redis`);
//     for (const message of pendingMessages) {
//       await redis.rPush("chatQueue", JSON.stringify(message));
//     }
//     pendingMessages.length = 0;
//   }
// };

// redis.on("ready", () => {
//   console.log("Connected to Redis");
//   flushPendingMessages();
// });

// redis.on("error", (err) => {
//   console.error("Redis Error:", err);
// });

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("joinRoom", (room) => {
//     console.log(`Socket ${socket.id} joining room ${room}`);
//     socket.join(room);
//   });

//   socket.on("chatMessage", async ({ message, room }) => {
//     console.log(`Message from ${socket.id} in room ${room}:`, message);

//     if (room) {
//       io.to(room).emit("chatMessage", message);
//       try {
//         if (redis.isReady) {
//           await redis.rPush("chatQueue", JSON.stringify(message));
//         } else {
//           pendingMessages.push(message);
//           console.warn("Redis unavailable, storing message locally.");
//         }
//       } catch (error) {
//         console.error("Error storing message:", error);
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// httpServer.listen(PORT, "0.0.0.0", () => {
//   console.log(`Socket.io server is running on http://0.0.0.0:${PORT}`);
// });

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import {redis} from "../../packages/db/redis/redisClient";
import isOnline from "is-online";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const PORT = 2000;
const pendingMessages = [];
let isInternetAvailable = true;

const initializeConnectivityMonitor = () => {
  setInterval(async () => {
    try {
      const currentStatus = await isOnline();
      if (!isInternetAvailable && currentStatus) {
        console.log("🌐 Internet connection restored!");
        await flushPendingMessages();
      }
      isInternetAvailable = currentStatus;
    } catch (error) {
      isInternetAvailable = false;
    }
  }, 5000);
};
const flushPendingMessages = async () => {
  if (!isInternetAvailable || !redis.isReady || pendingMessages.length === 0) return;

  console.log(`🔄 Attempting to flush ${pendingMessages.length} pending messages`);
  
  while (pendingMessages.length > 0) {
    const message = pendingMessages[0];
    try {
      await redis.rPush("chatQueue", JSON.stringify(message));
      pendingMessages.shift();
    } catch (error) {
      console.error("❌ Failed to flush messages, retaining in local storage:", error);
      break;
    }
  }
};

// Redis connection handlers
redis
  .on("ready", () => {
    console.log("✅ Redis connection established");
    flushPendingMessages();
  })
  .on("end", () => console.log("🔴 Redis connection closed"))
  .on("reconnecting", () => console.log("🔄 Redis reconnecting..."))
  .on("error", (err) => console.error("❌ Redis error:", err));

// Express middleware
app.use(cors());
app.use(express.json());

// API endpoint for message submission
app.post("/api/user/pushToQueue", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message?.userId || !message?.username || !message?.content) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    message.type = "message";
    const canUseRedis = isInternetAvailable && redis.isReady;

    if (canUseRedis) {
      await redis.rPush("chatQueue", JSON.stringify(message));
      return res.json({ 
        success: true, 
        message: "Message immediately processed"
      });
    }

    pendingMessages.push(message);
    console.log(`💾 Local storage count: ${pendingMessages.length}`);
    return res.status(503).json({
      success: true,
      warning: "Message stored locally",
      pendingCount: pendingMessages.length
    });

  } catch (error) {
    console.error("Error processing message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Socket.io handlers
io.on("connection", (socket) => {
  console.log(`⚡ New connection: ${socket.id}`);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`🚪 ${socket.id} joined room ${room}`);
  });

  socket.on("chatMessage", async ({ message, room }) => {
    try {
      // Immediate broadcast to room
      if (room) socket.to(room).emit("chatMessage", message);

      // Persistence handling
      const canUseRedis = isInternetAvailable && redis.isReady;
      
      if (canUseRedis) {
        await redis.rPush("chatQueue", JSON.stringify(message));
      } else {
        pendingMessages.push(message);
        console.log(`💾 Local storage (Socket): ${pendingMessages.length}`);
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🏃♂️ Connection closed: ${socket.id}`);
  });
});

// Server startup
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initializeConnectivityMonitor();
});