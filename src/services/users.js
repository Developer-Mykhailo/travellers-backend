import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { Types, startSession } from 'mongoose';
import {
  deleteFileFromCloudinary,
  saveFileToCloudinary,
} from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { StoriesCollection } from '../db/models/story.js';

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
    ' avatar name description publicStories',
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

  const mappedUsers = users.map((user) => ({
    ...user.toObject(),
    avatar: user.avatar?.url ?? null,
  }));

  return {
    data: mappedUsers,
    ...paginationData,
  };
};

//!---------------------------------------------------------------
export const getUserById = async (id) => {
  const user = await UserCollection.findById(id).select(
    'name avatar.url description publicStories',
  );

  if (!user) throw createHttpError(400, `User not found: ${id}`);

  return {
    ...user.toObject(),
    avatar: user.avatar?.url ?? null,
  };
};

//!---------------------------------------------------------------
export const getUserProfileById = async (id) => {
  const user = await UserCollection.findById(id).select(
    ' -avatar.publicId -email -password',
  );

  if (!user) throw createHttpError(400, `User not foud: ${id}`);

  const existingStories = await StoriesCollection.find({
    _id: { $in: user.savedStories },
  })
    .select('_id')
    .lean();

  if (existingStories.length !== user.savedStories.length) {
    await UserCollection.updateOne(
      { _id: user._id },
      { $set: { savedStories: existingStories } },
    );
  }

  return {
    ...user.toObject(),
    savedStories: existingStories.map((story) => story._id.toString()),
    avatar: user.avatar?.url ?? null,
  };
};

//!---------------------------------------------------------------
export const toggleSavedStory = async (storyId, userId) => {
  const isStoryExist = await StoriesCollection.findById(storyId);

  if (!isStoryExist) throw createHttpError(400, `Story not foud: ${storyId}`);

  const session = await startSession();
  session.startTransaction();

  try {
    const storyObjectId = new Types.ObjectId(storyId);

    const pullResult = await UserCollection.updateOne(
      { _id: userId, savedStories: storyObjectId },
      { $pull: { savedStories: storyObjectId } },
      { session },
    );

    if (pullResult.modifiedCount > 0) {
      await StoriesCollection.findByIdAndUpdate(
        storyId,
        { $inc: { favoriteCount: -1 } },
        { session },
      );

      await session.commitTransaction();
      return { saved: false };
    }

    await UserCollection.updateOne(
      { _id: userId },
      { $addToSet: { savedStories: storyObjectId } },
      { session },
    );

    await StoriesCollection.findByIdAndUpdate(
      storyId,
      { $inc: { favoriteCount: 1 } },
      { session },
    );

    await session.commitTransaction();
    return { saved: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

//!---------------------------------------------------------------
export const uploadAvatar = async (_id, avatar) => {
  if (!avatar) return null;

  const photoData =
    getEnvVar('ENABLE_CLOUDINARY') === 'true'
      ? await saveFileToCloudinary(avatar, 'avatars')
      : await saveFileToUploadDir(avatar);

  const prevUser = await UserCollection.findByIdAndUpdate(
    _id,
    { avatar: photoData },
    { new: false, runValidators: true },
  ).lean();

  const prevPublicId = prevUser?.avatar?.publicId;

  if (prevPublicId && getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    await deleteFileFromCloudinary(prevPublicId);
  }

  return photoData.url;
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
  ).select('-email');

  return updatedUser;
};
