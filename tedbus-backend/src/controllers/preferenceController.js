const notificationService = require("../services/notificationService");

const getPreferences = async (req, res, next) => {
  try {
    const preference = await notificationService.getOrCreatePreference(
      req.user._id
    );
    res.status(200).json({ success: true, preference });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const preference = await notificationService.updatePreference(
      req.user._id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Preferences updated",
      preference,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
};