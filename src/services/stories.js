import createHttpError from 'http-errors';

import { CategoryCollection } from '../db/models/category.js';
import { StoriesCollection } from '../db/models/story.js';
import { UserCollection } from '../db/models/users.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getStories = async (
  page = 1,
  perPage = 5,
  sortBy,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;

  const storiesQuery = StoriesCollection.find();
  const countQuery = StoriesCollection.find();

  if (filters.category) {
    storiesQuery.where('category').equals(filters.category);
    countQuery.where('category').equals(filters.category);
  }

  if (filters.owner) {
    storiesQuery.where('owner').equals(filters.owner);
    countQuery.where('owner').equals(filters.owner);
  }

  if (filters.search) {
    storiesQuery.where('article').regex(filters.search);
    countQuery.where('article').regex(filters.search);
  }

  storiesQuery.populate([
    { path: 'owner', select: 'name avatar description' },
    { path: 'category', select: 'name' },
  ]);

  // execute both requests
  const [storiesCount, stories] = await Promise.all([
    countQuery.countDocuments(),
    storiesQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return { data: stories, ...paginationData };
};

//!---------------------------------------------------------------
export const addStory = async ({ title, article, category, owner, img }) => {
  const categoryDoc = await CategoryCollection.findOne({ name: category });

  if (!categoryDoc)
    throw createHttpError(400, `Category not found: ${category}`);

  const newUser = await UserCollection.create({
    name: owner,
    email: 'test@test.com',
    password: '123456',
  });

  // const ownerDoc = await UserCollection.findOne({ name: owner });
  // if (!ownerDoc) throw createHttpError(400, `User not found: ${owner}`);

  return StoriesCollection.create({
    title,
    article,
    img,
    category: categoryDoc._id,
    owner: newUser,
  });
};
