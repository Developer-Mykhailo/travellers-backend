import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllUsers = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;

  const [usersCount, users] = await Promise.all([
    UserCollection.find().countDocuments().exec(),

    UserCollection.find()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return { data: users, ...paginationData };
};

//!---------------------------------------------------------------

export const getUserById = async (userId) => {
  const user = await UserCollection.findById(userId);

  return user;
};

//!---------------------------------------------------------------
