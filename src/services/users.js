import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { Types } from 'mongoose';
import {
  deleteFileFromCloudinary,
  saveFileToCloudinary,
} from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';

//!---------------------------------------------------------------
export const getAllUsers = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
) => {
  const skip = (page - 1) * perPage;

  const baseQuery = UserCollection.find().select(
    'avatar name description publicStories',
  );

  if (filters.nameRegex) {
    baseQuery.where('name').regex(filters.nameRegex);
  }

  const [usersCount, users] = await Promise.all([
    baseQuery.clone().countDocuments(),

    baseQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return { data: users, ...paginationData };
};

//!---------------------------------------------------------------
export const getUserById = async (id) => {
  const user = await UserCollection.findById(id);

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
  const user = await UserCollection.findById(id);

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

  if (pullResult.modifiedCount > 0) {
    return { saved: false };
  }

  await UserCollection.updateOne(
    { _id: userId },
    { $addToSet: { savedStories: storyObjectId } },
  );

  return { saved: true };
};

//!---------------------------------------------------------------
export const uploadAvatar = async (_id, avatar) => {
  let photoData = null;

  if (avatar) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoData = await saveFileToCloudinary(avatar, 'avatars');
    } else {
      photoData = await saveFileToUploadDir(avatar);
    }
  }

  const updatedUser = await UserCollection.findByIdAndUpdate(
    _id,
    {
      avatar: photoData,
    },
    { new: true, runValidators: true },
  );

  return updatedUser.avatar;
};

//!---------------------------------------------------------------
export const deleteAvatar = async (_id) => {
  const user = await UserCollection.findById(_id).lean();

  if (!user?.avatar?.publicId) return null;

  const publicId = user.avatar.publicId;

  await deleteFileFromCloudinary(publicId);

  await UserCollection.findByIdAndUpdate(
    _id,
    { avatar: {} },
    { runValidators: true },
  ).lean();

  return publicId;
};

//!---------------------------------------------------------------
export const updateUserInfo = async (_id, description) => {
  const updatedUser = await UserCollection.findByIdAndUpdate(
    _id,
    { description },
    { new: true },
  );

  return updatedUser;
};
