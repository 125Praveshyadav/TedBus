const Forum = require("../models/Forum");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const createForum = async ({ name, description, icon, createdBy }) => {
  const slug = generateSlug(name);

  const existing = await Forum.findOne({ $or: [{ name }, { slug }] });
  if (existing) {
    const error = new Error("Forum with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const forum = await Forum.create({
    name,
    description,
    icon,
    slug,
    createdBy,
  });

  return forum;
};

const getForums = async (filters) => {
  const { page = 1, limit = 10, search, isActive, sortBy = "latest" } = filters;
  const skip = (page - 1) * limit;

  const query = {};
  if (isActive !== undefined) query.isActive = isActive;
  if (search) query.name = new RegExp(search, "i");

  let sort = { createdAt: -1 };
  if (sortBy === "oldest") sort = { createdAt: 1 };
  if (sortBy === "mostDiscussed") sort = { discussionCount: -1 };

  const [forums, total] = await Promise.all([
    Forum.find(query)
      .populate("createdBy", "name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Forum.countDocuments(query),
  ]);

  return {
    forums,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getForumBySlug = async (slug) => {
  const forum = await Forum.findOne({ slug, isActive: true }).populate(
    "createdBy",
    "name profileImage"
  );

  if (!forum) {
    const error = new Error("Forum not found");
    error.statusCode = 404;
    throw error;
  }

  return forum;
};

const getForumById = async (forumId) => {
  const forum = await Forum.findById(forumId).populate(
    "createdBy",
    "name profileImage"
  );

  if (!forum) {
    const error = new Error("Forum not found");
    error.statusCode = 404;
    throw error;
  }

  return forum;
};

const updateForum = async (forumId, updateData) => {
  const forum = await Forum.findById(forumId);

  if (!forum) {
    const error = new Error("Forum not found");
    error.statusCode = 404;
    throw error;
  }

  if (updateData.name) {
    updateData.slug = generateSlug(updateData.name);
  }

  Object.assign(forum, updateData);
  await forum.save();

  return forum;
};

const deleteForum = async (forumId) => {
  const forum = await Forum.findById(forumId);

  if (!forum) {
    const error = new Error("Forum not found");
    error.statusCode = 404;
    throw error;
  }

  forum.isActive = false;
  await forum.save();

  return forum;
};

module.exports = {
  createForum,
  getForums,
  getForumBySlug,
  getForumById,
  updateForum,
  deleteForum,
};