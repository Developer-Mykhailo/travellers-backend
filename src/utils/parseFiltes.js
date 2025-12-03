import createHttpError from 'http-errors';
import { STORY_CATEGORIES } from '../constants/validation.js';

const parseCategory = (category) => {
  if (typeof category !== 'string') return;
  const isCategory = (category) => STORY_CATEGORIES.includes(category);

  if (isCategory(category)) return category;
  else throw createHttpError(400, `Not found in this category: ${category}`);
};

export const parseFilters = ({ category }) => {
  const parsedCategory = parseCategory(category);
  return { category: parsedCategory };
};
