const Joi = require("joi");
const validateRequest = require("./validateRequest");

const objectId = Joi.string().hex().length(24);

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500).required(),
  parentComment: objectId.allow(null, "").optional(),
});

const updateCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500).required(),
});

const commentQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid("latest", "oldest").default("latest"),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const commentIdParamSchema = Joi.object({
  commentId: objectId.required(),
});

const postIdParamSchema = Joi.object({
  postId: objectId.required(),
});

module.exports = {
  validateCreateComment: validateRequest(createCommentSchema, "body"),
  validateUpdateComment: validateRequest(updateCommentSchema, "body"),
  validateCommentQuery: validateRequest(commentQuerySchema, "query"),
  validateIdParam: validateRequest(idParamSchema, "params"),
  validateCommentIdParam: validateRequest(commentIdParamSchema, "params"),
  validatePostIdParam: validateRequest(postIdParamSchema, "params"),
};