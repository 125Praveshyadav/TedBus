const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Razorpay = require("razorpay");
// const { sendTicketEmail } = require("../services/emailService");
const sendTicketEmail = require("../services/sendTicketEmail");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Generate PNR
const generatePNR = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pnr = "";
  for (let i = 0; i < 10; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

// @desc    Create Razorpay order
// @route   POST /api/v1/payments/create-order
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { bookingId, amount, paymentMethod, couponCode } = req.body;

  // Validate booking
  const booking = await Booking.findOne({ bookingId })
    .populate("user")
    .populate("bus");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // Apply coupon if provided
  let finalAmount = amount;
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (coupon) {
      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit exceeded",
        });
      }

      // Check minimum purchase
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

      // Update coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  // Create Razorpay order
  const options = {
    amount: Math.round(finalAmount * 100), // Razorpay accepts amount in paise
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

  // Update booking with order details
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

// @desc    Verify Razorpay payment
// @route   POST /api/v1/payments/verify-payment
// @access  Private
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
      .populate("user")
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
      
    // Send confirmation email with PDF
try {
  // Populate bus + user before sending email
  const populatedBooking = await booking.populate([
    { path: "user", select: "name email phone" },
    { path: "bus" },
  ]);

  // Don't await — let it run in background so user response is fast
  sendTicketEmail(populatedBooking).catch((err) =>
    console.error("Background email failed:", err.message)
  );
} catch (err) {
  console.error("Email trigger error:", err.message);
}



    // try {
    //   if (typeof sendTicketEmail === "function") {
    //     await sendTicketEmail(booking);
    //   }
    // } catch (mailError) {
    //   console.warn("Ticket email send failed:", mailError.message);
    // }

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

// @desc    Get payment details
// @route   GET /api/v1/payments/:paymentId
// @access  Private
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

// @desc    Apply coupon
// @route   POST /api/v1/payments/apply-coupon
// @access  Private
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

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({
      success: false,
      message: "Coupon usage limit exceeded",
    });
  }

  // Check minimum purchase
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

// @desc    Refund payment
// @route   POST /api/v1/payments/refund
// @access  Private
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

  // Create refund in Razorpay
  const refund = await razorpay.payments.refund(booking.paymentId, {
    amount: Math.round(booking.totalAmount * 100), // Full refund
    notes: {
      reason: reason,
      bookingId: bookingId,
    },
  });

  // Update booking
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
