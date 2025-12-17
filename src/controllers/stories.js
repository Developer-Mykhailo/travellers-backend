import createHttpError from 'http-errors';
import { STORIES_SORT_FIELDS } from '../constants/validation.js';
import {
  addStory,
  deleteStory,
  getCategories,
  getStoryById,
  updateStory,
} from '../services/stories.js';
import { getStories } from '../services/stories.js';
import { parseFilters } from '../utils/parseFiltes.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

//!---------------------------------------------------------------
export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(
    req.query,
    STORIES_SORT_FIELDS,
    STORIES_SORT_FIELDS[0],
  );
  const filters = await parseFilters(req.query);

  const data = await getStories(page, perPage, sortBy, sortOrder, filters);

  res.json({
    status: 200,
    message: 'Successfully found stories!',
    data,
  });
};

//!---------------------------------------------------------------
export const getStoryByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await getStoryById(id);

  res.json({
    status: 200,
    message: 'Successfully found story',
    data,
  });
  //
};

//!---------------------------------------------------------------
export const addStoryController = async (req, res) => {
  const userId = req.user._id;

  const data = await addStory({ ...req.body }, userId, req.file);

  res.status(201).json({
    status: 201,
    message: 'Story successfully created!',
    data,
  });
};

//!---------------------------------------------------------------
export const deleteStoryController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const data = await deleteStory(id, userId);

  if (!data) throw createHttpError('404', 'Story not found');

  res.status(204).send();
};

//!---------------------------------------------------------------
export const getCategoriesController = async (req, res) => {
  const data = await getCategories();

  res.json({
    status: 200,
    message: 'Successfully found categories!',
    data,
  });
};

//!---------------------------------------------------------------
export const updateStoryContoroller = async (req, res) => {
  const userId = req.user._id;
  const { id: storyId } = req.params;
  const payload = req.body;
  const photo = req.file;

  const newStory = await updateStory(userId, storyId, payload, photo);

  res.json({
    status: 200,
    message: 'The story has been updated successfully!',
    data: newStory,
  });
};
