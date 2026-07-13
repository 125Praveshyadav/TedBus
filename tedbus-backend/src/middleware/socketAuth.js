const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketAuth = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1] ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id name role");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.userId = user._id.toString();
    socket.userName = user.name;
    socket.userRole = user.role;

    next();
  } catch (error) {
    console.error("Socket auth failed:", error.message);
    next(new Error("Invalid or expired token"));
  }
};

module.exports = socketAuth;