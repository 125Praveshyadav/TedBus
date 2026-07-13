const { notifyUser } = require("./notificationDispatcher");
const User = require("../models/User");
const Discussion = require("../models/Discussion");
const Reply = require("../models/Reply");
const Forum = require("../models/Forum");

const createDiscussion = async ({ forumId, author, title, content, route, tags }) => {
  const forum = await Forum.findOne({ _id: forumId, isActive: true });

  if (!forum) {
    const error = new Error("Forum not found");
    error.statusCode = 404;
    throw error;
  }

  const discussion = await Discussion.create({
    forum: forumId,
    author,
    title,
    content,
    route,
    tags,
  });

  forum.discussionCount += 1;
  await forum.save();

  return discussion.populate("author", "name profileImage");
};

const getDiscussionsByForum = async (forumId, filters) => {
  const {
    page = 1,
    limit = 10,
    search,
    source,
    destination,
    tag,
    sortBy = "latest",
  } = filters;
  const skip = (page - 1) * limit;

  const query = { forum: forumId, isDeleted: false, status: "approved" };

  if (source) query["route.source"] = new RegExp(source, "i");
  if (destination) query["route.destination"] = new RegExp(destination, "i");
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  let sort = { isPinned: -1, createdAt: -1 };
  if (sortBy === "oldest") sort = { isPinned: -1, createdAt: 1 };
  if (sortBy === "popular") sort = { isPinned: -1, views: -1 };
  if (sortBy === "mostReplied") sort = { isPinned: -1, replyCount: -1 };

  const [discussions, total] = await Promise.all([
    Discussion.find(query)
      .populate("author", "name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Discussion.countDocuments(query),
  ]);

  return {
    discussions,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getDiscussionById = async (discussionId) => {
  const discussion = await Discussion.findOneAndUpdate(
    { _id: discussionId, isDeleted: false },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name profileImage");

  if (!discussion) {
    const error = new Error("Discussion not found");
    error.statusCode = 404;
    throw error;
  }

  return discussion;
};

const updateDiscussion = async (discussionId, userId, updateData, isAdmin) => {
  const discussion = await Discussion.findOne({ _id: discussionId, isDeleted: false });

  if (!discussion) {
    const error = new Error("Discussion not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && discussion.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to update this discussion");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(discussion, updateData);
  await discussion.save();

  return discussion;
};

const deleteDiscussion = async (discussionId, userId, isAdmin) => {
  const discussion = await Discussion.findOne({ _id: discussionId, isDeleted: false });

  if (!discussion) {
    const error = new Error("Discussion not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && discussion.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to delete this discussion");
    error.statusCode = 403;
    throw error;
  }

  discussion.isDeleted = true;
  await discussion.save();

  const forum = await Forum.findById(discussion.forum);
  if (forum && forum.discussionCount > 0) {
    forum.discussionCount -= 1;
    await forum.save();
  }

  return discussion;
};

const createReply = async ({ discussionId, author, text, parentReply }) => {
  const discussion = await Discussion.findOne({ _id: discussionId, isDeleted: false });

  if (!discussion) {
    const error = new Error("Discussion not found");
    error.statusCode = 404;
    throw error;
  }

  if (discussion.isClosed) {
    const error = new Error("This discussion is closed for new replies");
    error.statusCode = 403;
    throw error;
  }

  if (parentReply) {
    const parent = await Reply.findOne({ _id: parentReply, isDeleted: false });
    if (!parent) {
      const error = new Error("Parent reply not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const reply = await Reply.create({
    discussion: discussionId,
    author,
    text,
    parentReply: parentReply || null,
  });

  discussion.replyCount += 1;
  await discussion.save();
  // 🔔 NOTIFICATION TRIGGER — Reply on Discussion
  if (discussion.author.toString() !== author.toString()) {
    const sender = await User.findById(author).select("name");

    notifyUser({
      recipientId: discussion.author,
      senderId: author,
      type: "community_reply",
      title: "New Reply 💬",
      message: `${sender?.name || "Someone"} replied to your discussion "${discussion.title}"`,
      icon: "message-square",
      actionUrl: `/community/discussions/${discussionId}`,
      referenceType: "Discussion",
      referenceId: reply._id,
       metadata: {
    senderName: sender?.name || "Someone",
    discussionTitle: discussion.title,
    replyText: text.substring(0, 100),
    discussionId: discussionId,
  },
    }).catch((err) => console.error("Reply notification failed:", err.message));
  } 

  return reply.populate("author", "name profileImage");
};

const getRepliesByDiscussion = async (discussionId, filters) => {
  const { page = 1, limit = 10, sortBy = "oldest" } = filters;
  const skip = (page - 1) * limit;

  const sort = sortBy === "latest" ? { createdAt: -1 } : { createdAt: 1 };

  const query = { discussion: discussionId, isDeleted: false };

  const [replies, total] = await Promise.all([
    Reply.find(query)
      .populate("author", "name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Reply.countDocuments(query),
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

const updateReply = async (replyId, userId, text) => {
  const reply = await Reply.findOne({ _id: replyId, isDeleted: false });

  if (!reply) {
    const error = new Error("Reply not found");
    error.statusCode = 404;
    throw error;
  }

  if (reply.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to update this reply");
    error.statusCode = 403;
    throw error;
  }

  reply.text = text;
  await reply.save();

  return reply;
};

const deleteReply = async (replyId, userId, isAdmin) => {
  const reply = await Reply.findOne({ _id: replyId, isDeleted: false });

  if (!reply) {
    const error = new Error("Reply not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && reply.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to delete this reply");
    error.statusCode = 403;
    throw error;
  }

  reply.isDeleted = true;
  await reply.save();

  const discussion = await Discussion.findById(reply.discussion);
  if (discussion && discussion.replyCount > 0) {
    discussion.replyCount -= 1;
    await discussion.save();
  }

  return reply;
};

const markBestAnswer = async (replyId, discussionId, userId) => {
  const discussion = await Discussion.findOne({ _id: discussionId, isDeleted: false });

  if (!discussion) {
    const error = new Error("Discussion not found");
    error.statusCode = 404;
    throw error;
  }

  if (discussion.author.toString() !== userId.toString()) {
    const error = new Error("Only the discussion author can mark best answer");
    error.statusCode = 403;
    throw error;
  }

  await Reply.updateMany({ discussion: discussionId }, { isBestAnswer: false });

  const reply = await Reply.findByIdAndUpdate(
    replyId,
    { isBestAnswer: true },
    { new: true }
  );

  if (!reply) {
    const error = new Error("Reply not found");
    error.statusCode = 404;
    throw error;
  }

  return reply;
};

module.exports = {
  createDiscussion,
  getDiscussionsByForum,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  createReply,
  getRepliesByDiscussion,
  updateReply,
  deleteReply,
  markBestAnswer,
};