const express = require("express");

const router = express.Router();

const {
  addBus,
  getAllBuses,
  searchBus,
  getBusDetails,
  getBusSeats,
} = require("../controllers/busController");

router.post("/add", addBus);

router.get("/all", getAllBuses);

router.get("/search", searchBus);

// Seat availability
router.get("/:id/seats", getBusSeats);

// Single bus details
router.get("/:id", getBusDetails);

module.exports = router;