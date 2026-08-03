const SavedRoute = require("../models/SavedRoute");

exports.saveRoute = async (req, res) => {
  try {
    const { name, start, end, waypoints } = req.body;

    if (!name?.trim() || !start?.lat || !start?.lng || !end?.lat || !end?.lng) {
      return res.status(400).json({
        success: false,
        message: "Route name, start and end locations are required",
      });
    }

    const count = await SavedRoute.countDocuments({ user: req.user._id });
    if (count >= 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum 20 saved routes allowed",
      });
    }

    const route = await SavedRoute.create({
      user: req.user._id,
      name: name.trim(),
      start,
      end,
      waypoints: waypoints || [],
    });

    res.status(201).json({ success: true, message: "Route saved", route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyRoutes = async (req, res) => {
  try {
    const routes = await SavedRoute.find({ user: req.user._id }).sort({
      lastUsedAt: -1,
    });
    res.status(200).json({ success: true, count: routes.length, routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markRouteUsed = async (req, res) => {
  try {
    const route = await SavedRoute.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { lastUsedAt: new Date() },
      { returnDocument: "after" }
    );

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    res.status(200).json({ success: true, route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const route = await SavedRoute.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    res.status(200).json({ success: true, message: "Route deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};