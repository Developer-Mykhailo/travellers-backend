import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { StoriesCollection } from '../db/models/story.js';

export const getAllUsers = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;

  const baseQuery = UserCollection.find();

  if (filters.nameRegex) {
    baseQuery.where('name').regex(filters.nameRegex);
  }

  const [usersCount, users] = await Promise.all([
    baseQuery.clone().countDocuments(),

    baseQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .lean(),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return { data: users, ...paginationData };
};

//!---------------------------------------------------------------

export const getUserById = async (id) => {
  const user = await UserCollection.findById(id).lean();

  if (!user) throw createHttpError(400, `User not foud: ${id}`);

  return user;
};

//!---------------------------------------------------------------
export const toggleSavedStory = async (storyId, userId) => {
  const story = await StoriesCollection.findById(storyId).lean();
  if (!story) throw createHttpError(400, `Story not found: ${storyId}`);

  const user = await UserCollection.findById(userId).lean();
  const isSaved = user.savedStories.includes(storyId);

  if (isSaved) {
    return await UserCollection.findByIdAndUpdate(
      userId,
      { $pull: { savedStories: storyId } },
      { new: true },
    ).lean();
  } else {
    return await UserCollection.findByIdAndUpdate(
      userId,
      { $addToSet: { savedStories: storyId } },
      { new: true },
    ).lean();
  }
};
