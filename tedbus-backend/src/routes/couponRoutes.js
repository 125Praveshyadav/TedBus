const express = require("express");

const router = express.Router();

const {
  getActiveCoupons,
  validateCoupon,
} = require("../controllers/couponController");

router.get("/active", getActiveCoupons);

router.post("/validate", validateCoupon);

module.exports = router;