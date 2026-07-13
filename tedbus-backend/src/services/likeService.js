const { notifyUser } = require("./notificationDispatcher");
const Like = require("../models/Like");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const toggleLike = async ({ userId, postId, commentId }) => {
  const filter = { user: userId };

  if (postId) filter.post = postId;
  if (commentId) filter.comment = commentId;

  const existingLike = await Like.findOne(filter);

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });

    if (postId) {
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
    }
    if (commentId) {
      await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: -1 } });
    }

    return { liked: false };
  }

  if (postId) {
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
  }

  if (commentId) {
    const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      throw error;
    }
  }

  // 🔑 Fix: Sirf relevant field add karo, null field mat rakho
  const likeData = { user: userId };
  if (postId) likeData.post = postId;
  if (commentId) likeData.comment = commentId;

  await Like.create(likeData);

  if (postId) {
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
    
  }
  if (commentId) {
    await Comment.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } });
      // 🔔 NOTIFICATION TRIGGER — Like on Post
    const post = await Post.findById(postId).populate("author", "name");
    if (post && post.author._id.toString() !== userId.toString()) {
      const User = require("../models/User");
      const sender = await User.findById(userId).select("name");

      notifyUser({
        recipientId: post.author._id,
        senderId: userId,
        type: "community_like",
        title: "New Like ❤️",
        message: `${sender?.name || "Someone"} liked your post "${post.title}"`,
        icon: "heart",
        actionUrl: `/community/post/${postId}`,
        referenceType: "Post",
        referenceId: postId,
         metadata: {
    senderName: sender?.name || "Someone",
    postTitle: post.title,
    postId: postId,
  },
      }).catch((err) => console.error("Like notification failed:", err.message));
    }
  }

  return { liked: true };
};

// Baaki functions same rehenge
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