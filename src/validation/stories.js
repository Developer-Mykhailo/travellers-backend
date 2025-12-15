import Joi from 'joi';

export const createStorySchema = Joi.object({
  title: Joi.string().min(3).max(128).required(),
  article: Joi.string().allow('').required(),
  category: Joi.string().min(3).required(),
  owner: Joi.string().required(),
});

// export const updateStoriesSchema = Joi.object({
//   title: Joi.string().min(3).max(128),
//   article: Joi.string().allow(''),
//   fullText: Joi.string().allow(''),
//   category: Joi.string().valid(...STORIES_SORT_FIELDS),
// });
