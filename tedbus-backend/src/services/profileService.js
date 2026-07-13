const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const SavedPost = require("../models/SavedPost");

const getUserCommunityProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "name email profileImage city createdAt"
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const [postCount, commentCount, likesReceived] = await Promise.all([
    Post.countDocuments({ author: userId, isDeleted: false }),
    Comment.countDocuments({ author: userId, isDeleted: false }),
    Post.aggregate([
      { $match: { author: user._id, isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$likeCount" } } },
    ]),
  ]);

  const totalLikesReceived = likesReceived[0]?.total || 0;

  const badges = calculateBadges({ postCount, totalLikesReceived });

  return {
    user,
    stats: {
      postCount,
      commentCount,
      totalLikesReceived,
    },
    badges,
  };
};

const calculateBadges = ({ postCount, totalLikesReceived }) => {
  const badges = [];

  if (postCount >= 1) badges.push("Explorer");
  if (postCount >= 10) badges.push("Trusted Reviewer");
  if (postCount >= 25) badges.push("Top Contributor");
  if (totalLikesReceived >= 100) badges.push("Community Favorite");

  return badges;
};

const toggleSavePost = async (userId, postId) => {
  const existing = await SavedPost.findOne({ user: userId, post: postId });

  if (existing) {
    await SavedPost.deleteOne({ _id: existing._id });
    return { saved: false };
  }

  await SavedPost.create({ user: userId, post: postId });
  return { saved: true };
};

const getSavedPosts = async (userId, filters) => {
  const { page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const query = { user: userId };

  const [savedPosts, total] = await Promise.all([
    SavedPost.find(query)
      .populate({
        path: "post",
        populate: { path: "author", select: "name profileImage" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    SavedPost.countDocuments(query),
  ]);

  return {
    savedPosts,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getLeaderboard = async (limit = 10) => {
  const leaderboard = await Post.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$author",
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: "$likeCount" },
        totalComments: { $sum: "$commentCount" },
      },
    },
    {
      $addFields: {
        score: {
          $add: ["$totalLikes", { $multiply: ["$totalComments", 2] }],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        "user.name": 1,
        "user.profileImage": 1,
        totalPosts: 1,
        totalLikes: 1,
        totalComments: 1,
        score: 1,
      },
    },
  ]);

  return leaderboard;
};

module.exports = {
  getUserCommunityProfile,
  toggleSavePost,
  getSavedPosts,
  getLeaderboard,
};