const commentService = require("../services/commentService");

const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment({
      postId: req.params.postId,
      author: req.user._id,
      text: req.body.text,
      parentComment: req.body.parentComment,
    });

    res.status(201).json({ success: true, message: "Comment added successfully", comment });
  } catch (error) {
    next(error);
  }
};

const getCommentsByPost = async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByPost(req.params.postId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getReplies = async (req, res, next) => {
  try {
    const result = await commentService.getReplies(req.params.commentId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.commentId,
      req.user._id,
      req.body.text
    );
    res.status(200).json({ success: true, message: "Comment updated successfully", comment });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    await commentService.deleteComment(req.params.commentId, req.user._id, isAdmin);
    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment,
};