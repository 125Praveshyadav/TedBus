const Joi = require("joi");
const validateRequest = require("./validateRequest");

const objectId = Joi.string().hex().length(24);

const notificationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  type: Joi.string()
    .valid(
      "booking_confirmed",
      "booking_cancelled",
      "schedule_changed",
      "journey_reminder",
      "promotional",
      "community_like",
      "community_comment",
      "community_reply",
      "system"
    )
    .optional(),
  isRead: Joi.boolean().optional(),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const sendNotificationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  message: Joi.string().trim().min(5).max(500).required(),
  type: Joi.string()
    .valid("promotional", "system", "schedule_changed")
    .required(),
  recipientIds: Joi.array().items(objectId).optional(),
  sendToAll: Joi.boolean().default(false),
});

module.exports = {
  validateNotificationQuery: validateRequest(notificationQuerySchema, "query"),
  validateIdParam: validateRequest(idParamSchema, "params"),
  validateSendNotification: validateRequest(sendNotificationSchema, "body"),
};