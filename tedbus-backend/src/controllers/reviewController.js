const mongoose = require("mongoose");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

/* =========================
   CREATE REVIEW
========================= */
exports.createReview = async (req, res) => {
  try {
    const { bookingId, busId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, rating, and comment are required",
      });
    }

    if (comment.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Review must be at least 20 characters",
      });
    }

    const booking = await Booking.findById(bookingId).populate("bus");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own journeys",
      });
    }

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "You can only review completed journeys",
      });
    }

    const journeyDate = new Date(booking.journeyDate);
    if (journeyDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: "You can only review after your journey is completed",
      });
    }

    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Only verified users can post reviews",
      });
    }

    const existing = await Review.findOne({
      user: req.user._id,
      booking: bookingId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this journey",
      });
    }

    // booking schema me bus field hai
    const resolvedBusId =
      booking?.bus?._id || booking?.bus || busId;

    if (!resolvedBusId) {
      return res.status(400).json({
        success: false,
        message: "Bus reference missing in booking",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      bus: resolvedBusId,
      booking: bookingId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await updateBusRating(resolvedBusId);

    await review.populate("user", "name profileImage");

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this journey",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   EDIT REVIEW
========================= */
exports.editReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const hoursSinceCreation =
      (Date.now() - new Date(review.createdAt)) /
      (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return res.status(400).json({
        success: false,
        message:
          "Reviews can only be edited within 24 hours of submission",
      });
    }

    if (comment && comment.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Review must be at least 20 characters",
      });
    }

    if (comment) {
      review.comment = comment.trim();
      review.isEdited = true;
      review.editedAt = new Date();
    }

    if (rating) {
      review.rating = Number(rating);
    }

    await review.save();
    await updateBusRating(review.bus);
    await review.populate("user", "name profileImage");

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET REVIEWS FOR A BUS
========================= */
exports.getBusReviews = async (req, res) => {
  try {
    const { busId } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bus ID",
      });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };

    if (sort === "highest") {
      sortOption = { rating: -1, createdAt: -1 };
    }

    if (sort === "lowest") {
      sortOption = { rating: 1, createdAt: -1 };
    }

    if (sort === "helpful") {
      sortOption = { upvotes: -1, createdAt: -1 };
    }

    const busObjectId = new mongoose.Types.ObjectId(busId);

    const query = {
      bus: busObjectId,
      isHidden: false,
    };

    const [reviews, total, distribution, bus] = await Promise.all([
      Review.find(query)
        .populate("user", "name profileImage")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),

      Review.countDocuments(query),

      Review.aggregate([
        {
          $match: {
            bus: busObjectId,
            isHidden: false,
          },
        },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
      ]),

      Bus.findById(busId).select("rating totalReviews"),
    ]);

    const ratingDist = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    distribution.forEach((item) => {
      ratingDist[item._id] = item.count;
    });

    return res.status(200).json({
      success: true,
      reviews,
      averageRating: bus?.rating || 0,
      totalReviews: total,
      ratingDistribution: ratingDist,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   CHECK IF USER CAN REVIEW
========================= */
exports.checkCanReview = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (
      !booking ||
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(200).json({
        canReview: false,
        reason: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(200).json({
        canReview: false,
        reason: "Journey not completed",
      });
    }

    const journeyDate = new Date(booking.journeyDate);
    if (journeyDate > new Date()) {
      return res.status(200).json({
        canReview: false,
        reason: "Journey not yet completed",
      });
    }

    const existing = await Review.findOne({
      user: req.user._id,
      booking: bookingId,
    });

    if (existing) {
      const hoursSince =
        (Date.now() - new Date(existing.createdAt)) /
        (1000 * 60 * 60);

      return res.status(200).json({
        canReview: false,
        alreadyReviewed: true,
        canEdit: hoursSince <= 24,
        review: existing,
        reason: "Already reviewed",
      });
    }

    return res.status(200).json({
      canReview: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPVOTE REVIEW
========================= */
exports.upvoteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const userId = req.user._id.toString();
    const alreadyUpvoted = review.upvotedBy
      .map((u) => u.toString())
      .includes(userId);

    if (alreadyUpvoted) {
      review.upvotedBy = review.upvotedBy.filter(
        (u) => u.toString() !== userId,
      );
      review.upvotes = Math.max(0, review.upvotes - 1);
    } else {
      review.upvotedBy.push(req.user._id);
      review.upvotes += 1;
    }

    await review.save();

    return res.status(200).json({
      success: true,
      upvotes: review.upvotes,
      isUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   REPORT REVIEW
========================= */
exports.reportReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const userId = req.user._id.toString();

    if (
      review.reportedBy.map((u) => u.toString()).includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Already reported",
      });
    }

    review.reportedBy.push(req.user._id);
    review.reportCount += 1;

    if (review.reportCount >= 5) {
      review.isHidden = true;
      review.hiddenReason =
        "Auto-hidden due to multiple reports";
      await updateBusRating(review.bus);
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review reported successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET MY REVIEWS
========================= */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    })
      .populate("bus", "name busName source destination")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ADMIN: HIDE / SHOW REVIEW
========================= */
exports.adminToggleHideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.isHidden = !review.isHidden;
    review.hiddenReason = review.isHidden
      ? "Hidden by admin"
      : null;

    await review.save();
    await updateBusRating(review.bus);

    return res.status(200).json({
      success: true,
      message: `Review ${review.isHidden ? "hidden" : "restored"}`,
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   HELPER: UPDATE BUS AVERAGE RATING
========================= */
const updateBusRating = async (busId) => {
  const normalizedBusId =
    typeof busId === "string"
      ? new mongoose.Types.ObjectId(busId)
      : busId;

  const result = await Review.aggregate([
    {
      $match: {
        bus: normalizedBusId,
        isHidden: false,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avg =
    result.length > 0
      ? Math.round(result[0].averageRating * 10) / 10
      : 0;

  const total =
    result.length > 0 ? result[0].totalReviews : 0;

  await Bus.findByIdAndUpdate(normalizedBusId, {
    rating: avg,
    totalReviews: total,
  });
};