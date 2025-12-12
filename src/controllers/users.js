import { USERS_SORT_FILEDS } from '../constants/validation.js';
import { getAllUsers, getUserById } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, USERS_SORT_FILEDS);

  const data = await getAllUsers(page, perPage, sortBy, sortOrder);

  res.json({
    status: 200,
    message: 'Users successfuly  found!',
    data,
  });
};

//!---------------------------------------------------------------

export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await getUserById(id);

  res.json({
    status: 200,
    message: 'User successfuly found!',
    data,
  });
};
