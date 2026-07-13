const postService = require("../services/postService");
const likeService = require("../services/likeService");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const createPost = async (req, res, next) => {
  try {
    let images = [];

    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, "community/posts"))
      );
      images = uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id }));
    }

    let tags = req.body.tags;
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    const post = await postService.createPost({
      author: req.user._id,
      title: req.body.title,
      content: req.body.content,
      postType: req.body.postType,
      images,
      route: {
        source: req.body.source || req.body.route?.source,
        destination: req.body.destination || req.body.route?.destination,
      },
      tags,
    });

    res.status(201).json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
        const isAdmin = req.user && req.user.role === "admin";
    const result = await postService.getPosts({ 
      ...req.query, 
      isAdmin: isAdmin // Service ko batao ki ye admin hai
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);

    let liked = false;
    if (req.user) {
      liked = await likeService.checkUserLiked({ userId: req.user._id, postId: post._id });
    }

    res.status(200).json({ success: true, post, liked });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    let tags = req.body.tags;
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    const updateData = { ...req.body };
    if (tags) updateData.tags = tags;

    const post = await postService.updatePost(req.params.id, req.user._id, updateData);
    res.status(200).json({ success: true, message: "Post updated successfully", post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    await postService.deletePost(req.params.id, req.user._id, isAdmin);
    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const result = await postService.getPostsByUser(req.user._id, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getPostsByUserId = async (req, res, next) => {
  try {
    const result = await postService.getPostsByUser(req.params.id, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getPostsByUserId,
};