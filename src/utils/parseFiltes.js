import createHttpError from 'http-errors';
import { CategoryCollection } from '../db/models/category.js';

export const parseFilters = async ({ category }) => {
  if (!category) return {};

  const decodedCategory = decodeURIComponent(category);

  const categoryDoc = await CategoryCollection.findOne({
    name: decodedCategory,
  });

  if (!categoryDoc) {
    throw createHttpError(400, `Category not found: ${category}`);
  }

  return { category: categoryDoc._id };
};
