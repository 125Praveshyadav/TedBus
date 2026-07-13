const Joi = require("joi");
const validateRequest = require("./validateRequest");

const objectId = Joi.string().hex().length(24);

const createForumSchema = Joi.object({
  name: Joi.string().trim().min(3).max(80).required(),
  description: Joi.string().trim().max(500).allow("").optional(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  icon: Joi.string().trim().max(20).allow("").optional(),
  isActive: Joi.boolean().optional(),
});

const updateForumSchema = Joi.object({
  name: Joi.string().trim().min(3).max(80).optional(),
  description: Joi.string().trim().max(500).allow("").optional(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  icon: Joi.string().trim().max(20).allow("").optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const forumQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().trim().max(100).allow("").optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid("latest", "oldest", "mostDiscussed").default("latest"),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const slugParamSchema = Joi.object({
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
});

module.exports = {
  validateCreateForum: validateRequest(createForumSchema, "body"),
  validateUpdateForum: validateRequest(updateForumSchema, "body"),
  validateForumQuery: validateRequest(forumQuerySchema, "query"),
  validateIdParam: validateRequest(idParamSchema, "params"),
  validateSlugParam: validateRequest(slugParamSchema, "params"),
};