const profileService = require("../services/profileService");

const getUserCommunityProfile = async (req, res, next) => {
  try {
    const result = await profileService.getUserCommunityProfile(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getMyCommunityProfile = async (req, res, next) => {
  try {
    const result = await profileService.getUserCommunityProfile(req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const toggleSavePost = async (req, res, next) => {
  try {
    const result = await profileService.toggleSavePost(req.user._id, req.params.postId);
    res.status(200).json({
      success: true,
      message: result.saved ? "Post saved" : "Post removed from saved",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getSavedPosts = async (req, res, next) => {
  try {
    const result = await profileService.getSavedPosts(req.user._id, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const leaderboard = await profileService.getLeaderboard(limit);
    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCommunityProfile,
  getMyCommunityProfile,
  toggleSavePost,
  getSavedPosts,
  getLeaderboard,
};