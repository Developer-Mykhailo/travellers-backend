import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { Types } from 'mongoose';

//!---------------------------------------------------------------
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

  return {
    name: user.name,
    avatar: user.avatar,
    description: user.description,
    publicStories: user.publicStories,
  };
};

//!---------------------------------------------------------------
export const getUserProfileById = async (id) => {
  const user = await UserCollection.findById(id).lean();

  if (!user) throw createHttpError(400, `User not foud: ${id}`);

  return user;
};

//!---------------------------------------------------------------
export const toggleSavedStory = async (storyId, userId) => {
  const storyObjectId = new Types.ObjectId(storyId);

  const pullResult = await UserCollection.updateOne(
    { _id: userId, savedStories: storyObjectId },
    { $pull: { savedStories: storyObjectId } },
  );

  console.log(pullResult);

  if (pullResult.modifiedCount > 0) {
    return { saved: false };
  }

  await UserCollection.updateOne(
    { _id: userId },
    { $addToSet: { savedStories: storyObjectId } },
  );

  return { saved: true };
};
