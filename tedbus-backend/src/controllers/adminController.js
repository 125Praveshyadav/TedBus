// const User = require("../models/User");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const Route = require("../models/Route");
const Setting = require("../models/Setting");

const getStartOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const getLastNDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

exports.getDashboard = async (req, res) => {
  try {
    const today = getStartOfToday();

    const [
      totalUsers,
      totalBuses,
      totalBookings,
      todaysBookings,
      activeRoutes,
      revenueAgg,
      recentBookings,
      recentUsers,
      bookingChart,
      revenueChart,
    ] = await Promise.all([
      User.countDocuments(),
      Bus.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({
        createdAt: { $gte: today },
      }),
      Route.countDocuments({
        isActive: true,
      }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),

      Booking.find()
        .populate("user", "name email phone")
        .populate("bus")
        .sort({ createdAt: -1 })
        .limit(8),

      User.find()
        .select("name email phone role createdAt")
        .sort({ createdAt: -1 })
        .limit(8),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: getLastNDays(7) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            bookings: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: getLastNDays(30) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBuses,
        totalBookings,
        totalRevenue: revenueAgg[0]?.totalRevenue || 0,
        todaysBookings,
        activeRoutes,
      },
      charts: {
        bookingChart,
        revenueChart,
      },
      recentBookings,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= BUSES ================= */

exports.getAdminBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buses.length,
      buses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAdminBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bus added successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus updated successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdminBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ROUTES ================= */

exports.getAdminRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAdminRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      message: "Route added successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdminRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= BOOKINGS ================= */

exports.getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("bus")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email phone")
      .populate("bus");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= USERS ================= */

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= PAYMENTS ================= */

exports.getAdminPayments = async (req, res) => {
  try {
    let payments = [];

    try {
      payments = await Payment.find()
        .populate("user", "name email phone")
        .populate({
          path: "booking",
          populate: [
            { path: "user", select: "name email phone" },
            { path: "bus" },
          ],
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      payments = [];
    }

    // Fallback: if Payment collection empty, use bookings with payment data
    if (!payments || payments.length === 0) {
      const bookings = await Booking.find({
        $or: [
          { paymentStatus: { $exists: true } },
          { orderId: { $exists: true } },
          { razorpayPaymentId: { $exists: true } },
        ],
      })
        .populate("user", "name email phone")
        .populate("bus")
        .sort({ updatedAt: -1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        payments: bookings.map((booking) => ({
          _id: booking._id,
          booking,
          user: booking.user,
          amount: booking.totalAmount,
          paymentStatus: booking.paymentStatus,
          paymentId: booking.paymentId || booking.razorpayPaymentId,
          razorpayPaymentId: booking.razorpayPaymentId,
          orderId: booking.orderId,
          paymentTime: booking.paymentTime,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        })),
      });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ================= REVIEWS ================= */

exports.getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("bus")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= SETTINGS ================= */

exports.getAdminSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminReports = async (req, res) => {
  try {
    const { range = "30d" } = req.query;

    let startDate = new Date();

    if (range === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (range === "90d") {
      startDate.setDate(startDate.getDate() - 90);
    } else if (range === "12m") {
      startDate.setMonth(startDate.getMonth() - 12);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    startDate.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      paidBookings,
      pendingBookings,
      cancelledBookings,
      failedPayments,
      totalRevenueAgg,
      revenueTrend,
      bookingTrend,
      paymentStatusStats,
      bookingStatusStats,
      topRoutes,
      topBuses,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments({
        createdAt: { $gte: startDate },
      }),

      Booking.countDocuments({
        createdAt: { $gte: startDate },
        paymentStatus: "Paid",
      }),

      Booking.countDocuments({
        createdAt: { $gte: startDate },
        paymentStatus: "Pending",
      }),

      Booking.countDocuments({
        createdAt: { $gte: startDate },
        bookingStatus: "Cancelled",
      }),

      Booking.countDocuments({
        createdAt: { $gte: startDate },
        paymentStatus: "Failed",
      }),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            averageBookingValue: { $avg: "$totalAmount" },
          },
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range === "12m" ? "%Y-%m" : "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: { $sum: "$totalAmount" },
            bookings: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range === "12m" ? "%Y-%m" : "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            bookings: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$paymentStatus",
            count: { $sum: 1 },
          },
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$bookingStatus",
            count: { $sum: 1 },
          },
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $lookup: {
            from: "buses",
            localField: "bus",
            foreignField: "_id",
            as: "bus",
          },
        },
        {
          $unwind: "$bus",
        },
        {
          $group: {
            _id: {
              source: "$bus.source",
              destination: "$bus.destination",
            },
            bookings: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalAmount", 0],
              },
            },
          },
        },
        {
          $sort: { bookings: -1 },
        },
        {
          $limit: 8,
        },
      ]),

      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $lookup: {
            from: "buses",
            localField: "bus",
            foreignField: "_id",
            as: "bus",
          },
        },
        {
          $unwind: "$bus",
        },
        {
          $group: {
            _id: "$bus._id",
            busName: { $first: "$bus.busName" },
            busNumber: { $first: "$bus.busNumber" },
            bookings: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalAmount", 0],
              },
            },
          },
        },
        {
          $sort: { revenue: -1 },
        },
        {
          $limit: 8,
        },
      ]),

      Booking.find({
        createdAt: { $gte: startDate },
      })
        .populate("user", "name email phone")
        .populate("bus")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;
    const averageBookingValue = totalRevenueAgg[0]?.averageBookingValue || 0;

    const conversionRate =
      totalBookings > 0 ? ((paidBookings / totalBookings) * 100).toFixed(1) : 0;

    const cancellationRate =
      totalBookings > 0
        ? ((cancelledBookings / totalBookings) * 100).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      range,
      summary: {
        totalBookings,
        paidBookings,
        pendingBookings,
        cancelledBookings,
        failedPayments,
        totalRevenue,
        averageBookingValue,
        conversionRate,
        cancellationRate,
      },
      charts: {
        revenueTrend,
        bookingTrend,
        paymentStatusStats,
        bookingStatusStats,
      },
      topRoutes,
      topBuses,
      recentBookings,
    });
  } catch (error) {
    console.error("GET ADMIN REPORTS ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// GET /api/v1/admin/profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/admin/profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, city, gender } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (gender !== undefined) updateData.gender = gender;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("ADMIN PROFILE UPDATE ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/admin/profile/photo
exports.updateAdminProfilePhoto = async (req, res) => {
  try {
    console.log("FILE RECEIVED =>", req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "tedbus/admin-profiles",
      width: 500,
      height: 500,
      crop: "fill",
    });

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profileImage: result.secure_url,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("ADMIN PROFILE PHOTO ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/admin/profile/change-password
exports.changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const admin = await User.findById(req.user._id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    admin.password = newPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateAdminProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "tedbus/admin-profiles",
      width: 500,
      height: 500,
      crop: "fill",
    });

    admin.profileImage = result.secure_url;

    await admin.save();

    const updatedAdmin = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("ADMIN PROFILE PHOTO ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};