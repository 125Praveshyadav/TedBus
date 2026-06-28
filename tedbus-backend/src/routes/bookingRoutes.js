const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getSingleBooking,
  downloadTicket,
  createPaymentOrder,
  
  cancelBooking,
} = require("../controllers/bookingController");

const {verifyPayment} = require("../controllers/paymentController")


const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/create", isAuthenticated, createBooking);

router.get("/my-bookings", isAuthenticated, getMyBookings);

router.get("/:id", isAuthenticated, getSingleBooking);

router.get("/:id/download", isAuthenticated, downloadTicket);

router.post("/create-order/:bookingId", isAuthenticated, createPaymentOrder);

router.post("/verify-payment", isAuthenticated, verifyPayment);

router.put("/cancel/:bookingId", isAuthenticated, cancelBooking);

module.exports = router;
