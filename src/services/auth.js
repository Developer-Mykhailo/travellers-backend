import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { randomBytes } from 'node:crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/users.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
  refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
});

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
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const oldSession = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) throw createHttpError(401, 'Session not found!');

  if (oldSession.refreshTokenValidUntil < new Date())
    throw createHttpError(401, 'Session token expired');

  await SessionsCollection.findByIdAndDelete(oldSession._id);

  return await SessionsCollection.create({
    userId: oldSession.userId,
    ...createSession(),
  });
};

//!---------------------------------------------------------------

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
