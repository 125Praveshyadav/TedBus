const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "config.env"),
});
const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");
const { initializeSocket } = require("./src/config/socket");
const socketAuth = require("./src/middleware/socketAuth");
 
// NEW — Cron Jobs import
const { startReminderJob } = require("./src/jobs/reminderJob");
const { startRetryJob } = require("./src/jobs/retryJob");
const PORT = process.env.PORT || 5000;
connectDB();

const server = http.createServer(app);
const io = initializeSocket(server);
io.use(socketAuth);



server.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
   console.log(`🔌 Socket.io ready for real-time connections`);
     startReminderJob();
  startRetryJob();
});

process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});