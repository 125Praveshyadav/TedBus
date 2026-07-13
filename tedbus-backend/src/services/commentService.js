const { notifyUser } = require("./notificationDispatcher");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async ({ postId, author, text, parentComment }) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if (parentComment) {
    const parent = await Comment.findOne({ _id: parentComment, isDeleted: false });
    if (!parent) {
      const error = new Error("Parent comment not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const comment = await Comment.create({
    post: postId,
    author,
    text,
    parentComment: parentComment || null,
  });

  post.commentCount += 1;
  await post.save();
   // 🔔 NOTIFICATION TRIGGER — Comment on Post
  if (post.author.toString() !== author.toString()) {
    const sender = await User.findById(author).select("name");

    notifyUser({
      recipientId: post.author,
      senderId: author,
      type: "community_comment",
      title: "New Comment 💬",
      message: `${sender?.name || "Someone"} commented on your post "${post.title}"`,
      icon: "message-circle",
      actionUrl: `/community/post/${postId}`,
      referenceType: "Comment",
      referenceId: comment._id,
       metadata: {
    senderName: sender?.name || "Someone",
    postTitle: post.title,
    commentText: text.substring(0, 100),
    postId: postId,
  },
    }).catch((err) => console.error("Comment notification failed:", err.message));
  }

  return comment.populate("author", "name profileImage");
};

const getCommentsByPost = async (postId, filters) => {
  const { page = 1, limit = 10, sortBy = "latest" } = filters;
  const skip = (page - 1) * limit;

  const sort = sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const query = { post: postId, parentComment: null, isDeleted: false };

  const [comments, total] = await Promise.all([
    Comment.find(query)
      .populate("author", "name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(query),
  ]);

  return {
    comments,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getReplies = async (commentId, filters) => {
  const { page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const query = { parentComment: commentId, isDeleted: false };

  const [replies, total] = await Promise.all([
    Comment.find(query)
      .populate("author", "name profileImage")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(query),
  ]);

  return {
    replies,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const updateComment = async (commentId, userId, text) => {
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });

  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  if (comment.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to update this comment");
    error.statusCode = 403;
    throw error;
  }

  comment.text = text;
  await comment.save();

  return comment;
};

const deleteComment = async (commentId, userId, isAdmin) => {
  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });

  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && comment.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to delete this comment");
    error.statusCode = 403;
    throw error;
  }

  comment.isDeleted = true;
  await comment.save();

  const post = await Post.findById(comment.post);
  if (post && post.commentCount > 0) {
    post.commentCount -= 1;
    await post.save();
  }

  return comment;
};

module.exports = {
  createComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment,
};