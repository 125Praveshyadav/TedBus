const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const busRoutes = require("./src/routes/busRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const couponRoutes = require("./src/routes/couponRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const app = express();
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const forumRoutes = require("./src/routes/forumRoutes");
const discussionRoutes = require("./src/routes/discussionRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const adminCommunityRoutes = require("./src/routes/adminCommunityRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const notificationRoutes = require("./src/routes/notificationRoutes");
const preferenceRoutes = require("./src/routes/preferenceRoutes");

const routePlannerRoutes = require("./src/routes/routePlannerRoutes");



app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TedBus API is running successfully",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use("/api/v1/community/posts", postRoutes);
app.use("/api/v1/community/posts/:postId/comments", commentRoutes);
app.use("/api/v1/community/likes", likeRoutes);
app.use("/api/v1/community/forums", forumRoutes);
app.use("/api/v1/community/discussions", discussionRoutes);
app.use("/api/v1/community/reports", reportRoutes);
app.use("/api/v1/community/profile", profileRoutes);
app.use("/api/v1/admin/community", adminCommunityRoutes);

app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/notifications/preferences", preferenceRoutes);
app.use("/api/v1/route-planner", routePlannerRoutes);


app.use(errorHandler);

module.exports = app;