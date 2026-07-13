const forumService = require("../services/forumService");

const createForum = async (req, res, next) => {
  try {
    const forum = await forumService.createForum({
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Forum created successfully", forum });
  } catch (error) {
    next(error);
  }
};

const getForums = async (req, res, next) => {
  try {
    const result = await forumService.getForums(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getForumBySlug = async (req, res, next) => {
  try {
    const forum = await forumService.getForumBySlug(req.params.slug);
    res.status(200).json({ success: true, forum });
  } catch (error) {
    next(error);
  }
};

const getForumById = async (req, res, next) => {
  try {
    const forum = await forumService.getForumById(req.params.id);
    res.status(200).json({ success: true, forum });
  } catch (error) {
    next(error);
  }
};

const updateForum = async (req, res, next) => {
  try {
    const forum = await forumService.updateForum(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Forum updated successfully", forum });
  } catch (error) {
    next(error);
  }
};

const deleteForum = async (req, res, next) => {
  try {
    await forumService.deleteForum(req.params.id);
    res.status(200).json({ success: true, message: "Forum deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createForum,
  getForums,
  getForumBySlug,
  getForumById,
  updateForum,
  deleteForum,
};