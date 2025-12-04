import { StoriesCollection } from '../db/models/story.js';

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

  if (filters.ownerId) {
    storiesQuery.where('ownerId').equals(filters.ownerId);
    countQuery.where('ownerId').equals(filters.ownerId);
  }

  storiesQuery.populate([
    { path: 'ownerId', select: 'name avatar description' },
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

  //  form the final objects
  const modifiedStories = stories.map((story) => {
    const obj = story.toObject();
    obj.owner = obj.ownerId;
    delete obj.ownerId;
    return obj;
  });

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return { data: modifiedStories, ...paginationData };
};
