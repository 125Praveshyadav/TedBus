const Joi = require("joi");
const validateRequest = require("./validateRequest");

const objectId = Joi.string().hex().length(24);

const createReportSchema = Joi.object({
  targetType: Joi.string().valid("Post", "Comment", "Discussion", "Reply").required(),
  targetId: objectId.required(),
  reason: Joi.string()
    .valid("spam", "abuse", "inappropriate", "misinformation", "other")
    .required(),
  description: Joi.when("reason", {
    is: "other",
    then: Joi.string().trim().min(5).max(500).required(),
    otherwise: Joi.string().trim().max(500).allow("").optional(),
  }),
});

const updateReportStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "reviewed", "resolved", "dismissed").required(),
});

const reportQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid("pending", "reviewed", "resolved", "dismissed").optional(),
  targetType: Joi.string().valid("Post", "Comment", "Discussion", "Reply").optional(),
  reason: Joi.string()
    .valid("spam", "abuse", "inappropriate", "misinformation", "other")
    .optional(),
  sortBy: Joi.string().valid("latest", "oldest").default("latest"),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const reportIdParamSchema = Joi.object({
  reportId: objectId.required(),
});

module.exports = {
  validateCreateReport: validateRequest(createReportSchema, "body"),
  validateUpdateReportStatus: validateRequest(updateReportStatusSchema, "body"),
  validateReportQuery: validateRequest(reportQuerySchema, "query"),
  validateIdParam: validateRequest(idParamSchema, "params"),
  validateReportIdParam: validateRequest(reportIdParamSchema, "params"),
};