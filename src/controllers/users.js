import { USERS_SORT_FILEDS } from '../constants/validation.js';
import { getAllUsers, getUserById, saveStoryById } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, USERS_SORT_FILEDS);

  const data = await getAllUsers(page, perPage, sortBy, sortOrder);

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

export const saveStoryByIdController = async (req, res) => {
  const userId = req.user._id;
  const { id: storyId } = req.params;

  const data = await saveStoryById(userId, storyId);

  res.json({
    status: 200,
    message: 'The story has been successfully saved',
    data,
  });
};
