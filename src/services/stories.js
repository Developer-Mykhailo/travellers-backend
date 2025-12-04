import { CategoryCollection } from '../db/models/category.js';
import { StoriesCollection } from '../db/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getStories = async (
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;

  const storiesQuery = StoriesCollection.find();
  const category = await CategoryCollection.findOne({ _id: filters.category });

  if (filters.category) {
    storiesQuery.where('category').equals(category._id);
  }

  storiesQuery.populate([
    { path: 'ownerId', select: 'name avatar description' },
    { path: 'category', select: 'name' },
  ]);

  const countQuery = StoriesCollection.find();

  if (filters.category) {
    countQuery.where('category').equals(category._id);
  }

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
