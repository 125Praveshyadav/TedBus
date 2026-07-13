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

const createDiscussionSchema = Joi.object({
  forum: objectId.optional(),
  title: Joi.string().trim().min(5).max(200).required(),
  content: Joi.string().trim().min(10).max(5000).required(),
  route: routeSchema.optional(),
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
  tags: tagsSchema.optional(),
});

const updateDiscussionSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).optional(),
  content: Joi.string().trim().min(10).max(5000).optional(),
  route: routeSchema.optional(),
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
  tags: tagsSchema.optional(),
  isPinned: Joi.boolean().optional(),
  isClosed: Joi.boolean().optional(),
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
}).min(1);

const createReplySchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
  parentReply: objectId.allow(null, "").optional(),
});

const updateReplySchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
});

const discussionQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().trim().max(100).allow("").optional(),
  source: Joi.string().trim().max(80).allow("").optional(),
  destination: Joi.string().trim().max(80).allow("").optional(),
  tag: Joi.string().trim().lowercase().max(30).allow("").optional(),
  sortBy: Joi.string()
    .valid("latest", "oldest", "popular", "mostReplied")
    .default("latest"),
});

const replyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid("latest", "oldest").default("oldest"),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const forumIdParamSchema = Joi.object({
  forumId: objectId.required(),
});

const discussionIdParamSchema = Joi.object({
  discussionId: objectId.required(),
});

const replyIdParamSchema = Joi.object({
  replyId: objectId.required(),
});

module.exports = {
  validateCreateDiscussion: validateRequest(createDiscussionSchema, "body"),
  validateUpdateDiscussion: validateRequest(updateDiscussionSchema, "body"),
  validateCreateReply: validateRequest(createReplySchema, "body"),
  validateUpdateReply: validateRequest(updateReplySchema, "body"),
  validateDiscussionQuery: validateRequest(discussionQuerySchema, "query"),
  validateReplyQuery: validateRequest(replyQuerySchema, "query"),
  validateIdParam: validateRequest(idParamSchema, "params"),
  validateForumIdParam: validateRequest(forumIdParamSchema, "params"),
  validateDiscussionIdParam: validateRequest(discussionIdParamSchema, "params"),
  validateReplyIdParam: validateRequest(replyIdParamSchema, "params"),
};