import createHttpError from 'http-errors';
import { CategoryCollection } from '../db/models/category.js';
import { UserCollection } from '../db/models/users.js';

export const parseFilters = async ({ category, ownerId }) => {
  const result = {};

  //todo category
  if (category) {
    // const decoded = decodeURIComponent(category);

    const categories = await CategoryCollection.find({
      name: { $regex: category, $options: 'i' },
    });
    if (categories.length === 0)
      throw createHttpError(400, `Category not found: ${category}`);
    result.category = categories.map((cat) => cat._id);
  }

  //todo owner
  if (ownerId) {
    // const decoded = decodeURIComponent(ownerId);

    const users = await UserCollection.find({
      name: { $regex: ownerId, $options: 'i' }, // нечутливо до регістру + частковий пошук
    });

    if (users.length === 0)
      throw createHttpError(400, `User not found: ${ownerId}`);

    result.ownerId = users.map((u) => u._id);
  }

  return result;
};
