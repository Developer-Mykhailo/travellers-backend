import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/users.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader)
    throw createHttpError(401, 'Please provide Authorization header');

  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer')
    throw createHttpError(401, 'Auth header should be of type Bearer');

  const session = await SessionsCollection.findOne({ accessToken });
  if (!session) throw createHttpError(401, 'Session not found');

  if (session.accessTokenValidUntil < new Date())
    throw createHttpError(401, 'Access token expired');

  const user = await UserCollection.findOne({ _id: session.userId });
  if (!user) throw createHttpError(401);

  req.user = user;

  next();
};
