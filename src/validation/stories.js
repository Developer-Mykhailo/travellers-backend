import Joi from 'joi';

export const createStorySchema = Joi.object({
  title: Joi.string().min(3).max(128).required(),
  article: Joi.string().allow('').required(),
  category: Joi.string().min(3).required(),
});

export const updateStoriesSchema = Joi.object({
  title: Joi.string().min(3).max(128),
  article: Joi.string().allow(''),
  category: Joi.string().min(3),
});
