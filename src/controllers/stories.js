import { STORIES_SORT_FIELDS } from '../constants/validation.js';
import { addStory, getStoryById } from '../services/stories.js';
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
  const data = await addStory({ ...req.body });

  res.status(201).json({
    status: 201,
    message: 'Story successfully created!',
    data,
  });
};
