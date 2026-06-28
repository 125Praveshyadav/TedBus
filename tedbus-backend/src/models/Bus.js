const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busName: String,

    busNumber: {
      type: String,
      unique: true,
    },

    operator: String,

    source: String,

    destination: String,

    journeyDate: Date,

    departureTime: String,

    arrivalTime: String,

    duration: String,

    totalSeats: Number,

    availableSeats: Number,

    price: Number,

    rating: {
      type: Number,
      default: 4,
    },

    busType: {
      type: String,
      enum: ["AC Sleeper", "AC Seater", "Non AC Sleeper", "Non AC Seater"],
    },
    boardingPoints: [
      {
        type: String,
      },
    ],

    droppingPoints: [
      {
        type: String,
      },
    ],
  bookedSeats: [
  {
    type: String,
    default: [],
  },
],
    amenities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Bus", busSchema);
