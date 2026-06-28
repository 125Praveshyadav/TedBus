const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const PDFDocument = require("pdfkit");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const generatePNR = require("../utils/generatePNR");
const sendTicketEmail = require(
  "../services/sendTicketEmail"
);
const generateTicketPdf = require("../utils/generateTicketPdf");


const getBookingSeats = (booking) => {
  if (Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 0) {
    return booking.seatNumbers;
  }

  if (Array.isArray(booking.passengerDetails)) {
    return booking.passengerDetails
      .flatMap((passenger) => {
        if (Array.isArray(passenger.seatNumber)) {
          return passenger.seatNumber;
        }

        return passenger.seatNumber ? [passenger.seatNumber] : [];
      })
      .filter(Boolean);
  }

  return [];
};

const normalizePassengerDetails = ({
  passengers = [],
  passengerDetails = [],
  seatNumbers = [],
  contactDetails = {},
}) => {
  const sourcePassengers =
    Array.isArray(passengerDetails) && passengerDetails.length > 0
      ? passengerDetails
      : passengers;

  return seatNumbers.map((seat, index) => {
    const passenger = sourcePassengers[index] || {};

    return {
      seatNumber:
        passenger.seatNumber ||
        passenger.seatNo ||
        passenger.seat ||
        seat,

      name: passenger.name,

      email:
        passenger.email ||
        contactDetails.email,

      phone:
        passenger.phone ||
        contactDetails.phone,

      age: passenger.age,

      gender: passenger.gender,
    };
  });
};



exports.createBooking = async (req, res) => {
  try {
    const {
      busId,
      bus,
      seatNumbers,
      seats,
      selectedSeats,
      passengerDetails,
      passengers,
      contactDetails,
      journeyDate,
      boardingPoint,
      droppingPoint,
      fare,
      couponCode,
    } = req.body;

    const finalBusId = busId || bus;

    const finalSeatNumbers =
      seatNumbers ||
      seats ||
      selectedSeats ||
      [];

    if (!finalBusId) {
      return res.status(400).json({
        success: false,
        message: "Bus ID is required",
      });
    }

    if (!Array.isArray(finalSeatNumbers) || finalSeatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select seats",
      });
    }

    if (!journeyDate) {
      return res.status(400).json({
        success: false,
        message: "Journey date is required",
      });
    }

    const busDoc = await Bus.findById(finalBusId);

    if (!busDoc) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const normalizedPassengers = normalizePassengerDetails({
      passengers,
      passengerDetails,
      seatNumbers: finalSeatNumbers,
      contactDetails,
    });

    if (normalizedPassengers.length !== finalSeatNumbers.length) {
      return res.status(400).json({
        success: false,
        message: "Passenger count must match selected seats",
      });
    }

    const invalidPassenger = normalizedPassengers.find(
      (passenger) =>
        !passenger.seatNumber ||
        !passenger.name ||
        !passenger.email ||
        !passenger.phone ||
        !passenger.age ||
        !passenger.gender
    );

    if (invalidPassenger) {
      return res.status(400).json({
        success: false,
        message:
          "Passenger details are incomplete. Name, email, phone, age and gender are required.",
      });
    }

    const parsedJourneyDate = new Date(journeyDate);

    if (Number.isNaN(parsedJourneyDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey date",
      });
    }

    const startOfDay = new Date(parsedJourneyDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedJourneyDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      bus: finalBusId,
      journeyDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bookingStatus: {
        $nin: ["Cancelled", "Expired"],
      },
      paymentStatus: {
        $ne: "Failed",
      },
    });

    const alreadyBookedFromBookings = existingBookings.flatMap(getBookingSeats);

    const alreadyBookedFromBus = Array.isArray(busDoc.bookedSeats)
      ? busDoc.bookedSeats
      : [];

    const alreadyBookedSeats = [
      ...new Set([...alreadyBookedFromBookings, ...alreadyBookedFromBus]),
    ];

    const alreadyBooked = finalSeatNumbers.filter((seat) =>
      alreadyBookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(", ")}`,
      });
    }

    const pricePerSeat =
      busDoc.price ||
      busDoc.fare ||
      busDoc.ticketPrice ||
      busDoc.baseFare ||
      busDoc.seatPrice ||
      0;

    const baseFare = pricePerSeat * finalSeatNumbers.length;
    const gst = fare?.gst ?? Math.round(baseFare * 0.05);
    const platformFee = fare?.platformFee ?? 50;
    const discountAmount = fare?.discountAmount ?? 0;

    const totalAmount = Math.max(
      baseFare + gst + platformFee - discountAmount,
      0
    );

    const pnr = generatePNR
      ? generatePNR()
      : "TED" + Math.floor(10000000 + Math.random() * 90000000);

    const booking = await Booking.create({
      user: req.user._id,
      bus: busDoc._id,
      pnr,

      journeyDate: parsedJourneyDate,

      seatNumbers: finalSeatNumbers,

      passengerDetails: normalizedPassengers,

      boardingPoint,
      droppingPoint,

      fareBreakup: {
        pricePerSeat,
        baseFare,
        gst,
        platformFee,
        discountAmount,
        couponCode: couponCode || fare?.couponCode || null,
        totalAmount,
      },

      totalAmount,

      bookingStatus: "Pending",
      paymentStatus: "Pending",
    });

    if (Array.isArray(busDoc.bookedSeats)) {
      busDoc.bookedSeats.push(...finalSeatNumbers);
      busDoc.bookedSeats = [...new Set(busDoc.bookedSeats)];
    }

    if (typeof busDoc.availableSeats === "number") {
      busDoc.availableSeats = Math.max(
        busDoc.availableSeats - finalSeatNumbers.length,
        0
      );
    }

    await busDoc.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get my booking
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("bus")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("bus");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Security Check
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("GET SINGLE BOOKING ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//download ticket
exports.downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("bus")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await generateTicketPdf(booking, res);
  } catch (error) {
    console.error("DOWNLOAD PDF ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//create pay order
exports.createPaymentOrder = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    booking.orderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//cancel
exports.cancelBooking = async (req, res) => {
  
  try {
    const { bookingId } = req.params;

    const { cancellationReason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
  console.log(
  "Booking User =>",
  booking.user.toString()
);

console.log(
  "Logged In User =>",
  req.user._id.toString()
);
    // Ownership check
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can cancel only your booking",
      });
    }

    // Already cancelled
    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    const bus = await Bus.findById(booking.bus);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Extract booked seats
  const bookedSeats = getBookingSeats(booking);

    // Release seats
    bus.bookedSeats = bus.bookedSeats.filter(
      (seat) => !bookedSeats.includes(seat),
    );

    bus.availableSeats += bookedSeats.length;

    await bus.save();

    // Update booking
    booking.bookingStatus = "Cancelled";

    booking.cancelledAt = new Date();

    booking.cancellationReason = cancellationReason || "User Cancelled";

    // Refund workflow
    if (booking.paymentStatus === "Paid") {
      booking.refundStatus = "Pending";
    } else {
      booking.refundStatus = "Not Applicable";
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const extractBookingSeats = (booking) => {
  if (Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 0) {
    return booking.seatNumbers;
  }

  if (Array.isArray(booking.passengerDetails)) {
    return booking.passengerDetails
      .flatMap((passenger) => {
        if (Array.isArray(passenger.seatNumber)) {
          return passenger.seatNumber;
        }

        return passenger.seatNumber ? [passenger.seatNumber] : [];
      })
      .filter(Boolean);
  }

  return [];
};


exports.getBusSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Journey date is required",
      });
    }

    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const journeyDate = new Date(date);

    if (Number.isNaN(journeyDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey date",
      });
    }

    const startOfDay = new Date(journeyDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(journeyDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      bus: id,
      journeyDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bookingStatus: {
        $nin: ["Cancelled", "Expired"],
      },
      paymentStatus: {
        $ne: "Failed",
      },
    });

    const bookedSeatsFromBookings = bookings.flatMap(extractBookingSeats);

    const bookedSeatsFromBus = Array.isArray(bus.bookedSeats)
      ? bus.bookedSeats
      : [];

    const bookedSeats = [
      ...new Set([...bookedSeatsFromBookings, ...bookedSeatsFromBus]),
    ];

    const totalSeats =
      bus.totalSeats ||
      bus.seats ||
      bus.availableSeats + bookedSeats.length ||
      48;

    const rows = Math.ceil(totalSeats / 4);
    const seatLetters = ["A", "B", "C", "D"];

    const seatFare =
      bus.price ||
      bus.fare ||
      bus.ticketPrice ||
      bus.baseFare ||
      bus.seatPrice ||
      0;

    const seats = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < seatLetters.length; col++) {
        if (seats.length >= totalSeats) break;

        const seatNo = `${row}${seatLetters[col]}`;

        seats.push({
          seatNo,
          seatNumber: seatNo,
          isBooked: bookedSeats.includes(seatNo),
          fare: seatFare,
        });
      }
    }

    res.status(200).json({
      success: true,
      bus,
      journeyDate: date,
      bookedSeats,
      seats,
    });
  } catch (error) {
    console.error("GET BUS SEATS ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};