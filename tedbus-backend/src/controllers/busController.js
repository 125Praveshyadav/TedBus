const Bus = require("../models/Bus");
const Booking = require("../models/Booking");

// Add Bus
exports.addBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bus added successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Buses
exports.getAllBuses = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Bus.countDocuments();

    const buses = await Bus.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: buses.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Bus API
exports.searchBus = async (req, res) => {
  try {
    const { source, destination, date, busType, sort } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: "Source, Destination and Date are required",
      });
    }

    const sourceCity = source.trim();
    const destinationCity = destination.trim();

    if (
      sourceCity.toLowerCase() === destinationCity.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be same",
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

    const query = {
      source: {
        $regex: sourceCity,
        $options: "i",
      },
      destination: {
        $regex: destinationCity,
        $options: "i",
      },
      journeyDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    // Optional filter, useful later from BusFilters.jsx
    if (busType) {
      query.busType = {
        $regex: busType.trim(),
        $options: "i",
      };
    }

    let sortOption = {};

    if (sort === "fare-low") {
      sortOption = { fare: 1 };
    } else if (sort === "fare-high") {
      sortOption = { fare: -1 };
    } else if (sort === "departure-early") {
      sortOption = { departureTime: 1 };
    } else if (sort === "departure-late") {
      sortOption = { departureTime: -1 };
    } else {
      sortOption = { departureTime: 1 };
    }

    const buses = await Bus.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: buses.length,
      buses,
      search: {
        source: sourceCity,
        destination: destinationCity,
        date,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Bus Details
exports.getBusDetails = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.name === "CastError"
          ? "Invalid bus ID"
          : error.message,
    });
  }
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
        $nin: ["cancelled", "Cancelled", "CANCELLED"],
      },
    });

    const bookedSeats = bookings.flatMap((booking) => {
      if (Array.isArray(booking.seats)) return booking.seats;

      if (Array.isArray(booking.selectedSeats)) return booking.selectedSeats;

      if (Array.isArray(booking.passengers)) {
        return booking.passengers
          .map((passenger) => passenger.seatNo || passenger.seatNumber)
          .filter(Boolean);
      }

      return [];
    });

    const totalSeats = bus.totalSeats || bus.seats || 48;
    const rows = Math.ceil(totalSeats / 4);
    const seatLetters = ["A", "B", "C", "D"];

    const seats = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < seatLetters.length; col++) {
        const seatNo = `${row}${seatLetters[col]}`;

        if (seats.length >= totalSeats) break;

        seats.push({
          seatNo,
          isBooked: bookedSeats.includes(seatNo),
          fare:
            bus.price ||
            bus.fare ||
            bus.ticketPrice ||
            bus.baseFare ||
            bus.seatPrice ||
            0,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};