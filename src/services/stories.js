import createHttpError from 'http-errors';

import { CategoryCollection } from '../db/models/category.js';
import { StoriesCollection } from '../db/models/story.js';
import { UserCollection } from '../db/models/users.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

//!---------------------------------------------------------------
export const getStories = async (
  page = 1,
  perPage = 5,
  sortBy,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;

  const baseQuery = StoriesCollection.find();

  if (filters.category) {
    baseQuery.where('category').equals(filters.category);
  }

  if (filters.owner) {
    baseQuery.where('owner').equals(filters.owner);
  }

  if (filters.search) {
    baseQuery.where('article').regex(filters.search);
  }

  // execute both requests
  const [storiesCount, stories] = await Promise.all([
    baseQuery.clone().countDocuments().exec(),

    baseQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .populate([
        { path: 'owner', select: 'name avatar description' },
        { path: 'category', select: 'name' },
      ])
      .exec(),
  ]);

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return { data: stories, ...paginationData };
};

//!---------------------------------------------------------------
export const getStoryById = async (id) => {
  const story = await StoriesCollection.findById(id);

  if (!story) throw createHttpError(400, `Story not foud: ${id}`);

  return story;
};

//!---------------------------------------------------------------
export const addStory = async (payload, photo) => {
  const { title, article, category, owner } = payload;
  let photoUrl = null;

  const categoryDoc = await CategoryCollection.findOne({ name: category });
  if (!categoryDoc)
    throw createHttpError(400, `Category not found: ${category}`);

  const ownerDoc = await UserCollection.findById(owner);
  if (!ownerDoc) throw createHttpError(400, `User not found: ${owner}`);

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  return StoriesCollection.create({
    title,
    article,
    category: categoryDoc._id,
    owner: ownerDoc._id,
    img: photoUrl,
  });
};

//!---------------------------------------------------------------
export const deleteStory = async (_id, userId) => {
  return await StoriesCollection.findOneAndDelete({ _id, owner: userId });
};
