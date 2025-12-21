import { USERS_SORT_FILEDS } from '../constants/validation.js';
import {
  getAllUsers,
  getUserById,
  getUserProfileById,
  toggleSavedStory,
  uploadAvatar,
} from '../services/users.js';
import { parseFilters } from '../utils/parseFiltes.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

//!---------------------------------------------------------------
export const getUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, USERS_SORT_FILEDS);

  const filters = await parseFilters(req.query);

  const data = await getAllUsers(page, perPage, sortBy, sortOrder, filters);

  res.json({
    status: 200,
    message: 'Users successfully  found!',
    data,
  });
};

//!---------------------------------------------------------------
export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await getUserById(id);

  res.json({
    status: 200,
    message: 'User successfully found!',
    data,
  });
};

//!---------------------------------------------------------------
export const getUserProfileByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await getUserProfileById(id);

  res.json({
    status: 200,
    message: 'User successfully found!',
    data,
  });
};

//!---------------------------------------------------------------
export const toggleSavedStoryController = async (req, res) => {
  const { id: storyId } = req.params;
  const userId = req.user._id;

  const result = await toggleSavedStory(storyId, userId);

  let state = result.saved === false ? 'deleted' : 'added';

  res.json({
    status: 200,
    message: `Story ${storyId} was successfully ${state}`,
    data: result,
  });
};

//!---------------------------------------------------------------
export const uploadAvatarController = async (req, res) => {
  const { _id } = req.user;
  const avatar = req.file;

  const data = await uploadAvatar(_id, avatar);

  res.json({
    status: 200,
    message: 'Avatar successfully uploaded!',
    data,
  });
};
