const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

exports.createReview = async (req, res) => {
  try {
    const { bookingId, busId, rating, comment } = req.body;

    if (!bookingId || !busId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Booking, bus, rating and comment are required",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can review only your booking",
      });
    }

    if (booking.bus.toString() !== busId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bus does not match this booking",
      });
    }

    if (booking.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid bookings can be reviewed",
      });
    }

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be reviewed",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      bus: busId,
      booking: bookingId,
      rating: Number(rating),
      comment,
    });

    await updateBusRating(busId);

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("bus");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR =>", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBusReviews = async (req, res) => {
  try {
    const { busId } = req.params;

    const reviews = await Review.find({
      bus: busId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const stats = await Review.aggregate([
      {
        $match: {
          bus: require("mongoose").Types.ObjectId.createFromHexString(busId),
        },
      },
      {
        $group: {
          _id: "$bus",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
      stats: stats[0] || {
        averageRating: 0,
        totalReviews: 0,
      },
    });
  } catch (error) {
    console.error("GET BUS REVIEWS ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    })
      .populate("bus")
      .populate("booking")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBusRating = async (busId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        bus: require("mongoose").Types.ObjectId.createFromHexString(
          busId.toString()
        ),
      },
    },
    {
      $group: {
        _id: "$bus",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Bus.findByIdAndUpdate(busId, {
      rating: Number(stats[0].averageRating.toFixed(1)),
    });
  }
};