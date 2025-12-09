import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/users.js';

export const registerUser = async (data) => {
  const { email, password } = data;

  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...data,
    password: hashPassword,
  });

  return {
    name: newUser.name,
    email: newUser.email,
  };
};
