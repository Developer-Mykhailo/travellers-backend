import { UserCollection } from '../db/models/users.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllUsers = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;

  const usersQuery = UserCollection.find(); //an instance of a future request

  const [usersCount, users] = await Promise.all([
    UserCollection.find().countDocuments().exec(),

    usersQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return { data: users, ...paginationData };
};
