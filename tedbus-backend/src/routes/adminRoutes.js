const express = require("express");

const router = express.Router();
const multer = require("multer");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} = require("../controllers/couponController");
const upload = require("../middleware/uploadMiddleware");

const {
  getDashboard,

  getAdminBuses,
  addAdminBus,
  updateAdminBus,
  deleteAdminBus,

  getAdminRoutes,
  addAdminRoute,
  updateAdminRoute,
  deleteAdminRoute,

  getAdminBookings,
  updateAdminBooking,

  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,

  getAdminPayments,

  getAdminReviews,
  deleteAdminReview,

  getAdminSettings,
  updateAdminSettings,

  getAdminReports,

  getAdminProfile,
  updateAdminProfile,
  updateAdminProfilePhoto,
  changeAdminPassword,
} = require("../controllers/adminController");

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/dashboard", getDashboard);

/* Buses */
router.get("/buses", getAdminBuses);
router.post("/bus", addAdminBus);
router.put("/bus/:id", updateAdminBus);
router.delete("/bus/:id", deleteAdminBus);

/* Routes */
router.get("/routes", getAdminRoutes);
router.post("/route", addAdminRoute);
router.put("/route/:id", updateAdminRoute);
router.delete("/route/:id", deleteAdminRoute);

/* Bookings */
router.get("/bookings", getAdminBookings);
router.put("/booking/:id", updateAdminBooking);

/* Users */
router.get("/users", getAdminUsers);
router.put("/user/:id", updateAdminUser);
router.delete("/user/:id", deleteAdminUser);

/* Payments */
router.get("/payments", getAdminPayments);

/* Reviews */
router.get("/reviews", getAdminReviews);
router.delete("/review/:id", deleteAdminReview);

router.get("/reports", getAdminReports);
/* Settings */
router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);

router.get("/profile", getAdminProfile);

router.put("/profile", updateAdminProfile);

router.put(
  "/profile/photo",
  upload.single("profileImage"),
  updateAdminProfilePhoto,
);

router.put("/profile/change-password", changeAdminPassword);

router.get("/coupons", getAdminCoupons);

router.post("/coupon", createAdminCoupon);

router.put("/coupon/:id", updateAdminCoupon);

router.delete("/coupon/:id", deleteAdminCoupon);
module.exports = router;
