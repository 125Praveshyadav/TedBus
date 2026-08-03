const express = require("express");
const router = express.Router();
const {
  saveRoute,
  getMyRoutes,
  markRouteUsed,
  deleteRoute,
} = require("../controllers/routePlannerController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.use(isAuthenticated);

router.post("/save", saveRoute);
router.get("/my-routes", getMyRoutes);
router.put("/:id/use", markRouteUsed);
router.delete("/:id", deleteRoute);

module.exports = router;