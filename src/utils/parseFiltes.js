import createHttpError from 'http-errors';
import { CategoryCollection } from '../db/models/category.js';
import { UserCollection } from '../db/models/users.js';

export const parseFilters = async ({ category, owner, query }) => {
  const result = {};

  //todo category
  if (category) {
    const categories = await CategoryCollection.find({
      name: { $regex: category, $options: 'i' },
    });
    if (categories.length === 0)
      throw createHttpError(400, `Category not found: ${category}`);
    result.category = categories.map((cat) => cat._id);
  }

  //todo owner
  if (owner) {
    const users = await UserCollection.find({
      $or: [
        { name: { $regex: owner, $options: 'i' } },
        { description: { $regex: owner, $options: 'i' } },
      ],
    });

    if (users.length === 0)
      throw createHttpError(400, `User not found: ${owner}`);

    result.owner = users.map((u) => u._id);
  }

  //todo
  if (query) {
    result.search = new RegExp(query, 'i');
  }

  return result;
};
