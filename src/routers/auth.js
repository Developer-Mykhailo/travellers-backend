import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  requestResetEmailController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);

authRouter.post('/login', validateBody(loginUserSchema), loginUserController);

authRouter.post('/refresh', refreshSessionController);

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

export default authRouter;
