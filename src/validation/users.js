import Joi from 'joi';

export const createUserSchema = Joi.object({
  description: Joi.string().min(47).max(135),
});
