const { Server } = require("socket.io");

let io = null;

const connectedUsers = new Map();

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`✅ User connected: ${userId} (Socket: ${socket.id})`);
    }

    socket.on("join", (roomUserId) => {
      if (roomUserId) {
        connectedUsers.set(roomUserId, socket.id);
        socket.join(`user_${roomUserId}`);
        console.log(`📌 User joined room: user_${roomUserId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      if (userId) {
        connectedUsers.delete(userId);
        console.log(`❌ User disconnected: ${userId} (Reason: ${reason})`);
      }
    });

    socket.on("error", (error) => {
      console.error(`Socket error for ${userId}:`, error.message);
    });
  });

  console.log("🔌 Socket.io initialized successfully");

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }
  return io;
};

const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString());
};

const getSocketId = (userId) => {
  return connectedUsers.get(userId.toString()) || null;
};

const sendToUser = (userId, event, data) => {
  if (!io) return false;

  const userIdStr = userId.toString();
  const socketId = connectedUsers.get(userIdStr);

  if (socketId) {
    io.to(socketId).emit(event, data);
    return true;
  }

  io.to(`user_${userIdStr}`).emit(event, data);
  return false;
};

const sendToAll = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

module.exports = {
  initializeSocket,
  getIO,
  isUserOnline,
  getSocketId,
  sendToUser,
  sendToAll,
};