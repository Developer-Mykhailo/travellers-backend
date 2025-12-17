import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { StoriesCollection } from '../db/models/story.js';

export const getAllUsers = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;

  const [usersCount, users] = await Promise.all([
    UserCollection.find().countDocuments().exec(),

    UserCollection.find()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return { data: users, ...paginationData };
};

//!---------------------------------------------------------------

export const getUserById = async (id) => {
  const user = await UserCollection.findById(id);

  if (!user) throw createHttpError(400, `User not foud: ${id}`);

  return user;
};

//!---------------------------------------------------------------
export const saveStoryById = async (userId, storyId) => {
  const storyToSave = await StoriesCollection.findById(storyId);

  if (!storyToSave) throw createHttpError(400, `Story not found: ${storyId}`);

  const updatedUser = await UserCollection.findByIdAndUpdate(
    userId,
    { $addToSet: { savedStories: storyId } }, // only adds if not already
    { new: true }, // returns an updated document
  );

  if (!updatedUser) throw createHttpError(400, `User not found: ${userId}`);

  return updatedUser;
};
