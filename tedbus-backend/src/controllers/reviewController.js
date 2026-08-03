const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const User = require("../models/User");


exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

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

    // 1. Booking exist karti hai?
    const booking = await Booking.findById(bookingId).populate("bus");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // 2. Booking is user ki hai?
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own journeys",
      });
    }

    // 3. Journey completed hai? (status Confirmed + date past)
    if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "You can only review completed journeys",
      });
    }

    const journeyDate = new Date(booking.journeyDate);
    const now = new Date();
    if (journeyDate > now) {
      return res.status(400).json({
        success: false,
        message: "You can only review after your journey is completed",
      });
    }

    // 4. User verified hai?
    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Only verified users can post reviews",
      });
    }

    // 5. Already reviewed?
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

    const review = await Review.create({
      user: req.user._id,
      bus: booking.bus._id,
      booking: bookingId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Bus ka average rating update karo
    await updateBusRating(booking.bus._id);

    await review.populate("user", "name profileImage");

    res.status(201).json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};


// EDIT REVIEW (24 hour window)

exports.editReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // 24 hour window check
    const hoursSinceCreation = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      return res.status(400).json({
        success: false,
        message: "Reviews can only be edited within 24 hours of submission",
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

    // Rating bhi 24h window mein change ho sakta hai
    if (rating) {
      review.rating = Number(rating);
    }

    await review.save();
    await updateBusRating(review.bus);
    await review.populate("user", "name profileImage");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET REVIEWS FOR A BUS

exports.getBusReviews = async (req, res) => {
  try {
    const { busId } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    if (sort === "lowest") sortOption = { rating: 1, createdAt: -1 };
    if (sort === "helpful") sortOption = { upvotes: -1, createdAt: -1 };

    const query = { bus: busId, isHidden: false };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("user", "name profileImage")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(query),
    ]);

    // Rating distribution (1-5 stars count)
    const distribution = await Review.aggregate([
      { $match: { bus: new require("mongoose").Types.ObjectId(busId), isHidden: false } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach((d) => { ratingDist[d._id] = d.count; });

    // Average rating
    const bus = await Bus.findById(busId).select("rating totalReviews");

    res.status(200).json({
      success: true,
      reviews,
      averageRating: bus?.rating || 0,
      totalReviews: total,
      ratingDistribution: ratingDist,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// CHECK IF USER CAN REVIEW

exports.checkCanReview = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(200).json({ canReview: false, reason: "Booking not found" });
    }

    if (booking.bookingStatus !== "Confirmed") {
      return res.status(200).json({ canReview: false, reason: "Journey not completed" });
    }

    const journeyDate = new Date(booking.journeyDate);
    if (journeyDate > new Date()) {
      return res.status(200).json({ canReview: false, reason: "Journey not yet completed" });
    }

    const existing = await Review.findOne({ user: req.user._id, booking: bookingId });
    if (existing) {
      const hoursSince = (Date.now() - new Date(existing.createdAt)) / (1000 * 60 * 60);
      return res.status(200).json({
        canReview: false,
        alreadyReviewed: true,
        canEdit: hoursSince <= 24,
        review: existing,
        reason: "Already reviewed",
      });
    }

    res.status(200).json({ canReview: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPVOTE REVIEW

exports.upvoteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const userId = req.user._id.toString();
    const alreadyUpvoted = review.upvotedBy.map((u) => u.toString()).includes(userId);

    if (alreadyUpvoted) {
      review.upvotedBy = review.upvotedBy.filter((u) => u.toString() !== userId);
      review.upvotes = Math.max(0, review.upvotes - 1);
    } else {
      review.upvotedBy.push(req.user._id);
      review.upvotes += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      upvotes: review.upvotes,
      isUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// REPORT REVIEW

exports.reportReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const userId = req.user._id.toString();
    if (review.reportedBy.map((u) => u.toString()).includes(userId)) {
      return res.status(400).json({ success: false, message: "Already reported" });
    }

    review.reportedBy.push(req.user._id);
    review.reportCount += 1;

    // 5 reports pe auto-hide
    if (review.reportCount >= 5) {
      review.isHidden = true;
      review.hiddenReason = "Auto-hidden due to multiple reports";
      await updateBusRating(review.bus);
    }

    await review.save();

    res.status(200).json({ success: true, message: "Review reported successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY REVIEWS

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("bus", "busName source destination")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ADMIN: HIDE / SHOW REVIEW

exports.adminToggleHideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.isHidden = !review.isHidden;
    review.hiddenReason = review.isHidden ? "Hidden by admin" : null;
    await review.save();
    await updateBusRating(review.bus);

    res.status(200).json({
      success: true,
      message: `Review ${review.isHidden ? "hidden" : "restored"}`,
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// HELPER: Update Bus Average Rating

const updateBusRating = async (busId) => {
  const result = await Review.aggregate([
    { $match: { bus: busId, isHidden: false } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avg = result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;
  const total = result.length > 0 ? result[0].totalReviews : 0;

  await Bus.findByIdAndUpdate(busId, {
    rating: avg,
    totalReviews: total,
  });
};