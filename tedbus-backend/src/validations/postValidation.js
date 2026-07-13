const Joi = require("joi");
const validateRequest = require("./validateRequest");

const objectId = Joi.string().hex().length(24);

const routeSchema = Joi.object({
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
});

const tagsSchema = Joi.alternatives().try(
  Joi.array().items(Joi.string().trim().lowercase().max(30)).max(15),
  Joi.string().trim().allow("")
);

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  content: Joi.string().trim().min(10).max(5000).required(),
  postType: Joi.string().valid("story", "tip", "photo", "discussion").default("story"),
  route: routeSchema.optional(),
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
  tags: tagsSchema.optional(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).optional(),
  content: Joi.string().trim().min(10).max(5000).optional(),
  postType: Joi.string().valid("story", "tip", "photo", "discussion").optional(),
  route: routeSchema.optional(),
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
  tags: tagsSchema.optional(),
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
}).min(1);

const postQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(220).default(10),
  search: Joi.string().trim().max(100).allow("").optional(),
  postType: Joi.string().valid("story", "tip", "photo", "discussion").optional(),
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
  tag: Joi.string().trim().lowercase().max(30).allow("").optional(),
  sortBy: Joi.string()
    .valid("latest", "popular", "trending", "mostLiked", "mostCommented")
    .default("latest"),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const postIdParamSchema = Joi.object({
  postId: objectId.required(),
});

module.exports = {
  validateCreatePost: validateRequest(createPostSchema, "body"),
  validateUpdatePost: validateRequest(updatePostSchema, "body"),
  validatePostQuery: validateRequest(postQuerySchema, "query"),
  validateIdParam: validateRequest(idParamSchema, "params"),
  validatePostIdParam: validateRequest(postIdParamSchema, "params"),
};