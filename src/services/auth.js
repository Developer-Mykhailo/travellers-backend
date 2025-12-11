import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/users.js';

import { randomBytes } from 'node:crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
import { SessionsCollection } from '../db/models/session.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
  refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
});

// export const findSession = (query) => SessionsCollection.findOne(query);
export const findUser = (query) => UserCollection.findOne(query);

//!---------------------------------------------------------------
export const registerUser = async (data) => {
  const { email, password } = data;

  const user = await UserCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email already in use');

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

//!---------------------------------------------------------------

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'User not found!');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

//!---------------------------------------------------------------
