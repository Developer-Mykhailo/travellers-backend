import { USERS_SORT_FILEDS } from '../constants/validation.js';
import {
  deleteAvatar,
  getAllUsers,
  getUserById,
  getUserProfileById,
  toggleSavedStory,
  updateUserInfo,
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
    message: `Successfully found user with id ${id}`,
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

  const newAvatar = await uploadAvatar(_id, avatar);

  res.json({
    status: 200,
    message: 'Avatar successfully uploaded!',
    data: {
      avatar: newAvatar,
    },
  });
};

//!---------------------------------------------------------------
export const deleteAvatarController = async (req, res) => {
  const { _id } = req.user;

  // eslint-disable-next-line
  const data = await deleteAvatar(_id);

  res.json({
    status: 200,
    message: 'Avatar was successfully deleted!',
    data: {
      avatar: null,
    },
  });
};

//!---------------------------------------------------------------
export const updateUserInfoController = async (req, res) => {
  const { _id } = req.user;
  const { description } = req.body;

  const data = await updateUserInfo(_id, description);

  res.json({
    status: 200,
    message: 'Successfully updated',
    data,
  });
};
