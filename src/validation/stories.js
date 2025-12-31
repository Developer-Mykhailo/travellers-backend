import Joi from 'joi';

export const createStorySchema = Joi.object({
  title: Joi.string().min(3).max(135).required(),
  article: Joi.string().min(30).max(500).required(),
  category: Joi.string().min(3).max(21).required(),
});

export const updateStoriesSchema = Joi.object({
  title: Joi.string().min(3).max(128),
  article: Joi.string().min(30).max(500),
  category: Joi.string().min(3).max(21),
});
