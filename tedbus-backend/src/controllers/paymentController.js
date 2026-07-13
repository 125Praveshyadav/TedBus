const { notifyUser } = require("../services/notificationDispatcher");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus"); // 🔑 FIX 1 — Ye line missing thi
const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const sendTicketEmail = require("../services/sendTicketEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generatePNR = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pnr = "";
  for (let i = 0; i < 10; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

exports.createOrder = asyncHandler(async (req, res) => {
  const { bookingId, amount, paymentMethod, couponCode } = req.body;

  const booking = await Booking.findOne({ bookingId })
    .populate("user")
    .populate("bus");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  let finalAmount = amount;
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (coupon) {
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit exceeded",
        });
      }

      if (amount < coupon.minPurchase) {
        return res.status(400).json({
          success: false,
          message: `Minimum purchase amount is ₹${coupon.minPurchase}`,
        });
      }

      if (coupon.discountType === "percentage") {
        discount = (amount * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }
      finalAmount = amount - discount;

      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const options = {
    amount: Math.round(finalAmount * 100),
    currency: "INR",
    receipt: bookingId,
    notes: {
      bookingId: bookingId,
      userId: req.user._id.toString(),
      paymentMethod: paymentMethod,
      couponCode: couponCode || "N/A",
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  booking.orderId = razorpayOrder.id;
  booking.totalAmount = finalAmount;
  booking.originalAmount = amount;
  booking.discount = discount;
  booking.couponCode = couponCode || null;
  booking.paymentMethod = paymentMethod;
  await booking.save();

  res.status(201).json({
    success: true,
    orderId: razorpayOrder.id,
    amount: finalAmount,
    currency: razorpayOrder.currency,
    bookingId: bookingId,
    key: process.env.RAZORPAY_KEY_ID,
    message: "Order created successfully",
  });
});

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("❌ RAZORPAY_KEY_SECRET missing in backend config.env");
      return res.status(500).json({
        success: false,
        message: "Razorpay secret missing on server",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const booking = await Booking.findOne({
      orderId: razorpay_order_id,
    })
      .populate("user", "name email phone")
      .populate("bus");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.paymentStatus = "Paid";
    booking.bookingStatus = "Confirmed";
    booking.paymentTime = new Date();
    booking.paymentId = razorpay_payment_id;
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentSignature = razorpay_signature;

    if (!booking.pnr && typeof generatePNR === "function") {
      booking.pnr = generatePNR();
    }

    await booking.save();

    // 🔔 FIX 2 — booking.bus already populated hai, seedha use karo
    // Bus.findById() ki zaroorat nahi
    const busName = booking.bus?.busName || "bus";
    const userId = booking.user?._id || booking.user;

    notifyUser({
      recipientId: userId, // FIX 3 — populated object se _id nikalo
      type: "booking_confirmed",
      title: "Booking Confirmed! 🎫",
      message: `Your booking PNR: ${booking.pnr} for ${busName} on ${new Date(booking.journeyDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} is confirmed! Seats: ${booking.seatNumbers?.join(", ")}. Total: ₹${booking.totalAmount}`,
      icon: "ticket",
      actionUrl: "/my-bookings",
      referenceType: "Booking",
      referenceId: booking._id,
    }).catch((err) => console.error("Booking confirm notification failed:", err.message));

    // 📧 Email with PDF — Background mein bhejo
    try {
      sendTicketEmail(booking).catch((err) =>
        console.error("Background email failed:", err.message)
      );
    } catch (err) {
      console.error("Email trigger error:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPaymentDetails = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    paymentId: req.params.paymentId,
  })
    .populate("user", "name email phone")
    .populate("bus");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.json({
    success: true,
    booking,
  });
});

exports.applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode, amount } = req.body;

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
    expiryDate: { $gte: new Date() },
  });

  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Invalid or expired coupon",
    });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({
      success: false,
      message: "Coupon usage limit exceeded",
    });
  }

  if (amount < coupon.minPurchase) {
    return res.status(400).json({
      success: false,
      message: `Minimum purchase amount is ₹${coupon.minPurchase}`,
    });
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  const finalAmount = amount - discount;

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      discount: coupon.discountValue,
      discountType: coupon.discountType,
      discountAmount: discount,
    },
    originalAmount: amount,
    finalAmount,
  });
});

exports.refundPayment = asyncHandler(async (req, res) => {
  const { bookingId, reason } = req.body;

  const booking = await Booking.findOne({ bookingId })
    .populate("user")
    .populate("bus");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  if (booking.paymentStatus !== "Paid") {
    return res.status(400).json({
      success: false,
      message: "Payment not completed",
    });
  }

  const refund = await razorpay.payments.refund(booking.paymentId, {
    amount: Math.round(booking.totalAmount * 100),
    notes: {
      reason: reason,
      bookingId: bookingId,
    },
  });

  booking.paymentStatus = "Refunded";
  booking.bookingStatus = "Cancelled";
  booking.refundId = refund.id;
  booking.refundTime = new Date();
  booking.cancellationReason = reason;

  await booking.save();

  res.json({
    success: true,
    message: "Refund initiated successfully",
    refund,
  });
});