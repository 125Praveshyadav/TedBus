const Post = require("../models/Post");
const Discussion = require("../models/Discussion");
const Comment = require("../models/Comment");
const Reply = require("../models/Reply");

const getPendingContent = async (req, res, next) => {
  try {
    const [posts, discussions] = await Promise.all([
      Post.find({ status: "pending", isDeleted: false }).populate("author", "name email"),
      Discussion.find({ status: "pending", isDeleted: false }).populate("author", "name email"),
    ]);

    res.status(200).json({ success: true, posts, discussions });
  } catch (error) {
    next(error);
  }
};

const updatePostStatus = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Post status updated", post });
  } catch (error) {
    next(error);
  }
};

const updateDiscussionStatus = async (req, res, next) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!discussion) {
      const error = new Error("Discussion not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Discussion status updated", discussion });
  } catch (error) {
    next(error);
  }
};

const getCommunityStats = async (req, res, next) => {
  try {
    const [totalPosts, totalComments, totalDiscussions, totalReplies] = await Promise.all([
      Post.countDocuments({ isDeleted: false }),
      Comment.countDocuments({ isDeleted: false }),
      Discussion.countDocuments({ isDeleted: false }),
      Reply.countDocuments({ isDeleted: false }),
    ]);

    res.status(200).json({
      success: true,
      stats: { totalPosts, totalComments, totalDiscussions, totalReplies },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingContent,
  updatePostStatus,
  updateDiscussionStatus,
  getCommunityStats,
};