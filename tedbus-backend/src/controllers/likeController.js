const likeService = require("../services/likeService");

const toggleLike = async (req, res, next) => {
  try {
    const { postId, commentId } = req.body;

    const result = await likeService.toggleLike({
      userId: req.user._id,
      postId,
      commentId,
    });

    res.status(200).json({
      success: true,
      message: result.liked ? "Liked successfully" : "Unliked successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getLikesByPost = async (req, res, next) => {
  try {
    const result = await likeService.getLikesByPost(req.params.postId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const checkUserLiked = async (req, res, next) => {
  try {
    const { postId, commentId } = req.query;

    const liked = await likeService.checkUserLiked({
      userId: req.user._id,
      postId,
      commentId,
    });

    res.status(200).json({ success: true, liked });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleLike,
  getLikesByPost,
  checkUserLiked,
};