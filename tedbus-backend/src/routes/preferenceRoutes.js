const express = require("express");
const router = express.Router();

const {
  getPreferences,
  updatePreferences,
} = require("../controllers/preferenceController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const {
  validateUpdatePreference,
} = require("../validations/preferenceValidation");

router.use(isAuthenticated);

router.get("/", getPreferences);
router.put("/", validateUpdatePreference, updatePreferences);

module.exports = router;