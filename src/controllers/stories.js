import { STORIES_SORT_FIELDS } from '../constants/validation.js';
import { getStories } from '../services/stories.js';
import { parseFilters } from '../utils/parseFiltes.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(
    req.query,
    STORIES_SORT_FIELDS,
    STORIES_SORT_FIELDS[0],
  );
  const filters = parseFilters(req.query);

  const data = await getStories(page, perPage, sortBy, sortOrder, filters);

  res.json({
    status: 200,
    message: 'Successfully found stories!',
    data,
  });
};

//---------------------------------------------------------------
