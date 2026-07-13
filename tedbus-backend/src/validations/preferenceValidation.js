const Joi = require("joi");
const validateRequest = require("./validateRequest");

const updatePreferenceSchema = Joi.object({
  channels: Joi.object({
    email: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    inApp: Joi.boolean().optional(),
  }).optional(),
  categories: Joi.object({
    booking_confirmed: Joi.boolean().optional(),
    booking_cancelled: Joi.boolean().optional(),
    schedule_changed: Joi.boolean().optional(),
    journey_reminder: Joi.boolean().optional(),
    promotional: Joi.boolean().optional(),
    community_like: Joi.boolean().optional(),
    community_comment: Joi.boolean().optional(),
    community_reply: Joi.boolean().optional(),
    system: Joi.boolean().optional(),
  }).optional(),
  quietHours: Joi.object({
    enabled: Joi.boolean().optional(),
    start: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),
    end: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),
  }).optional(),
  emailDigest: Joi.string()
    .valid("instant", "daily", "weekly", "none")
    .optional(),
}).min(1);

module.exports = {
  validateUpdatePreference: validateRequest(updatePreferenceSchema, "body"),
};