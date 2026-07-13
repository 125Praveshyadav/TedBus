const discussionService = require("../services/discussionService");

const createDiscussion = async (req, res, next) => {
  try {
    let tags = req.body.tags;
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    const discussion = await discussionService.createDiscussion({
      forumId: req.params.forumId,
      author: req.user._id,
      title: req.body.title,
      content: req.body.content,
      route: {
        source: req.body.source || req.body.route?.source,
        destination: req.body.destination || req.body.route?.destination,
      },
      tags,
    });

    res.status(201).json({ success: true, message: "Discussion created successfully", discussion });
  } catch (error) {
    next(error);
  }
};

const getDiscussionsByForum = async (req, res, next) => {
  try {
    const result = await discussionService.getDiscussionsByForum(req.params.forumId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getDiscussionById = async (req, res, next) => {
  try {
    const discussion = await discussionService.getDiscussionById(req.params.id);
    res.status(200).json({ success: true, discussion });
  } catch (error) {
    next(error);
  }
};

const updateDiscussion = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    const discussion = await discussionService.updateDiscussion(
      req.params.id,
      req.user._id,
      req.body,
      isAdmin
    );
    res.status(200).json({ success: true, message: "Discussion updated successfully", discussion });
  } catch (error) {
    next(error);
  }
};

const deleteDiscussion = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    await discussionService.deleteDiscussion(req.params.id, req.user._id, isAdmin);
    res.status(200).json({ success: true, message: "Discussion deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const createReply = async (req, res, next) => {
  try {
    const reply = await discussionService.createReply({
      discussionId: req.params.discussionId,
      author: req.user._id,
      text: req.body.text,
      parentReply: req.body.parentReply,
    });

    res.status(201).json({ success: true, message: "Reply added successfully", reply });
  } catch (error) {
    next(error);
  }
};

const getRepliesByDiscussion = async (req, res, next) => {
  try {
    const result = await discussionService.getRepliesByDiscussion(req.params.discussionId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const updateReply = async (req, res, next) => {
  try {
    const reply = await discussionService.updateReply(req.params.replyId, req.user._id, req.body.text);
    res.status(200).json({ success: true, message: "Reply updated successfully", reply });
  } catch (error) {
    next(error);
  }
};

const deleteReply = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    await discussionService.deleteReply(req.params.replyId, req.user._id, isAdmin);
    res.status(200).json({ success: true, message: "Reply deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const markBestAnswer = async (req, res, next) => {
  try {
    const reply = await discussionService.markBestAnswer(
      req.params.replyId,
      req.params.discussionId,
      req.user._id
    );
    res.status(200).json({ success: true, message: "Marked as best answer", reply });
  } catch (error) {
    next(error);
  }
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