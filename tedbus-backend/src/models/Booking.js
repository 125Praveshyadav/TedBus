const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pnr: {
      type: String,
      unique: true,
      sparse: true,
    },

    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    journeyDate: {
      type: Date,
      required: true,
    },

    seatNumbers: [
      {
        type: String,
        required: true,
      },
    ],

    passengerDetails: [
      {
        seatNumber: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        age: {
          type: Number,
          required: true,
        },

        gender: {
          type: String,
          required: true,
          enum: ["Male", "Female", "Other", "male", "female", "other"],
        },
      },
    ],

    boardingPoint: {
      type: String,
      trim: true,
    },

    droppingPoint: {
      type: String,
      trim: true,
    },

    fareBreakup: {
      pricePerSeat: {
        type: Number,
        default: 0,
      },
      baseFare: {
        type: Number,
        default: 0,
      },
      gst: {
        type: Number,
        default: 0,
      },
      platformFee: {
        type: Number,
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      couponCode: {
        type: String,
        default: null,
      },
      totalAmount: {
        type: Number,
        default: 0,
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Expired"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentId: {
      type: String,
    },

    paymentTime: {
      type: Date,
    },

    orderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },

    paymentSignature: {
      type: String,
    },

    cancelledAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
    },

    refundStatus: {
      type: String,
      enum: ["Pending", "Processed", "Not Applicable"],
      default: "Not Applicable",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);