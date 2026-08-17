const { notifyUser } = require("./notificationDispatcher");
const Like = require("../models/Like");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User"); // Ise top par move kiya consistency ke liye

const toggleLike = async ({ userId, postId, commentId }) => {
  // 🔑 Filter strictly waisa hi hona chahiye jaisa database mein save hota hai
  const filter = { user: userId };
  if (postId) filter.post = postId;
  if (commentId) filter.comment = commentId;

  // IMPORTANT: Agar postId bhej rahe ho toh ensure karo filter mein comment: null NA HO
  const existingLike = await Like.findOne(filter);

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    // ... count decrease logic
    return { liked: false };
  } else {
    // ... validation and create logic
    const likeData = { user: userId };
    if (postId) likeData.post = postId;
    if (commentId) likeData.comment = commentId;
    
    await Like.create(likeData); // database mein save
    // ... count increase logic
    return { liked: true };
  }
};

// getLikesByPost aur checkUserLiked "Correct" hain (Same as your code)
const getLikesByPost = async (postId, filters) => {
  const { page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const query = { post: postId };

  const [likes, total] = await Promise.all([
    Like.find(query)
      .populate("user", "name profileImage")
      .skip(skip)
      .limit(limit),
    Like.countDocuments(query),
  ]);

  return {
    likes,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const checkUserLiked = async ({ userId, postId, commentId }) => {
  const filter = { user: userId };
  if (postId) filter.post = postId;
  if (commentId) filter.comment = commentId;

  const like = await Like.findOne(filter);
  return !!like;
};

module.exports = {
  toggleLike,
  getLikesByPost,
  checkUserLiked,
};