const Post = require("../models/Post");

const createPost = async ({ author, title, content, postType, images, route, tags }) => {
  const post = await Post.create({
    author,
    title,
    content,
    postType,
    images,
    route,
    tags,
  });

  return post;
};

const getPosts = async (filters) => {
  const {
    page = 1,
    limit = 10,
    search,
    postType,
    source,
    destination,
    tag,
    sortBy = "latest",
    isAdmin = false,
  } = filters;

  const query = { isDeleted: false };
   if (!isAdmin) {
    query.status = "approved";
  }

  if (postType) query.postType = postType; 
  if (source) query["route.source"] = new RegExp(source, "i");
  if (destination) query["route.destination"] = new RegExp(destination, "i");
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  let sort = { createdAt: -1 };
  if (sortBy === "popular" || sortBy === "mostLiked") sort = { likeCount: -1 };
  if (sortBy === "mostCommented") sort = { commentCount: -1 };
  if (sortBy === "trending") sort = { views: -1, likeCount: -1 };

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate("author", "name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Post.countDocuments(query),
  ]);

  return {
    posts,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId) => {
  const post = await Post.findOneAndUpdate(
    { _id: postId, isDeleted: false },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name profileImage");

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  return post;
};

const updatePost = async (postId, userId, updateData) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if (post.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to update this post");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(post, updateData);
  await post.save();

  return post;
};

const deletePost = async (postId, userId, isAdmin) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && post.author.toString() !== userId.toString()) {
    const error = new Error("You are not authorized to delete this post");
    error.statusCode = 403;
    throw error;
  }

  post.isDeleted = true;
  await post.save();

  return post;
};

const getPostsByUser = async (authorId, filters) => {
  const { page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const query = { author: authorId, isDeleted: false };

  const [posts, total] = await Promise.all([
    Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Post.countDocuments(query),
  ]);

  return {
    posts,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
};