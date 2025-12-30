import createHttpError from 'http-errors';

import { CategoryCollection } from '../db/models/category.js';
import { StoriesCollection } from '../db/models/story.js';
import { UserCollection } from '../db/models/users.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  deleteFileFromCloudinary,
  saveFileToCloudinary,
} from '../utils/saveFileToCloudinary.js';

//!---------------------------------------------------------------
export const getCategories = async () => {
  const categories = await CategoryCollection.find().lean();

  return categories;
};

//!---------------------------------------------------------------
export const getStories = async (page, perPage, sortBy, sortOrder, filters) => {
  const skip = (page - 1) * perPage;

  const baseQuery = StoriesCollection.find().select('-img.publicId');

  if (filters.categoryRegex) {
    const categories = await CategoryCollection.find({
      name: { $regex: filters.categoryRegex },
    })
      .select('_id')
      .lean();

    baseQuery.where('category').in(categories.map((cat) => cat._id));
  }

  //---------------------------------------------------------------
  if (filters.queryRegex) {
    baseQuery.where({
      $or: [
        { title: { $regex: filters.queryRegex } },
        { article: { $regex: filters.queryRegex } },
      ],
    });
  }

  //---------------------------------------------------------------
  if (filters.ownerRegex) {
    const owner = await UserCollection.find({
      $or: [
        { name: { $regex: filters.ownerRegex } },
        { description: { $regex: filters.ownerRegex } },
      ],
    })
      .select('_id')
      .lean();

    if (owner.length === 0)
      throw createHttpError(400, `Owner not foud: ${filters.ownerRegex}`);

    baseQuery.where('owner').in(owner.map((u) => u._id));
  }

  // execute both requests
  const [storiesCount, stories] = await Promise.all([
    baseQuery.clone().countDocuments(),

    baseQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .populate([
        { path: 'owner', select: 'name avatar' },
        { path: 'category', select: 'name' },
      ]),
  ]);

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  const mappedStories = stories.map((story) => ({
    ...story.toObject(),

    img: story.img?.url ?? null,

    owner: story.owner
      ? {
          _id: story.owner._id,
          name: story.owner.name,
          avatar: story.owner.avatar?.url ?? null,
        }
      : null,
  }));

  return { data: mappedStories, ...paginationData };
};

//!---------------------------------------------------------------
export const getStoryById = async (id) => {
  const story = await StoriesCollection.findById(id)
    .select('-img.publicId ')
    .lean();

  if (!story) throw createHttpError(400, `Story not foud: ${id}`);

  const categoryDoc = await CategoryCollection.findById(story.category);
  const ownerDoc = await UserCollection.findById(story.owner).select('name');

  const data = {
    ...story,
    category: categoryDoc.name,
    owner: ownerDoc.name,
  };

  return data;
};

//!---------------------------------------------------------------
export const addStory = async (payload, userId, photo) => {
  const { title, article, category } = payload;

  let photoData = null;

  const categoryDoc = await CategoryCollection.findOne({
    name: category,
  }).lean();

  if (!categoryDoc)
    throw createHttpError(400, `Category not found: ${category}`);

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoData = await saveFileToCloudinary(photo, 'stories');
    } else {
      photoData = await saveFileToUploadDir(photo);
    }
  }

  const newStory = await StoriesCollection.create({
    title,
    article,
    category: categoryDoc._id,
    owner: userId,
    img: photoData,
  });

  await UserCollection.findByIdAndUpdate(userId, {
    $addToSet: { publicStories: newStory._id },
  }).lean();

  return { ...newStory.toObject(), img: photoData.url };
};

//!---------------------------------------------------------------
export const updateStory = async (userId, storyId, payload, photo) => {
  const story = await StoriesCollection.findOne({
    _id: storyId,
    owner: userId,
  }).lean();

  if (!story) throw createHttpError(404, 'Story not found');

  if (payload.category) {
    const categoryDoc = await CategoryCollection.findOne({
      name: payload.category,
    }).lean();

    if (!categoryDoc)
      throw createHttpError(400, `Category not found: ${payload.category}`);

    story.category = categoryDoc;
  }

  if (photo) {
    const { img: { publicId } = {} } = story;

    if (publicId) await deleteFileFromCloudinary(publicId);

    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      story.img = await saveFileToCloudinary(photo, 'stories');
    } else {
      await saveFileToUploadDir(photo);
    }
  }

  const updatedStory = await StoriesCollection.findByIdAndUpdate(
    storyId,
    {
      ...payload,
      category: story.category,
      img: story.img,
    },
    { new: true, runValidators: true },
  ).lean();

  return updatedStory;
};

//!---------------------------------------------------------------
export const deleteStory = async (_id, userId) => {
  const story = await StoriesCollection.findOne({ _id, owner: userId }).lean();
  if (!story) throw createHttpError(404, 'Story not found');

  const { img: { publicId } = {} } = story;

  if (publicId) {
    await deleteFileFromCloudinary(publicId);
  }

  await UserCollection.findByIdAndUpdate(
    userId,
    { $pull: { publicStories: _id } },
    { new: true },
  );

  return await StoriesCollection.deleteOne({ _id, owner: userId });
};
