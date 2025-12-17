import { Router } from 'express';
import {
  getUserByIdController,
  getUsersController,
  toggleSavedStoryController,
} from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.get('/', ctrlWrapper(getUsersController));

userRouter.get('/:id', isValidId, ctrlWrapper(getUserByIdController));

userRouter.patch(
  '/toggle-save-story/:id',
  authenticate,
  isValidId,
  ctrlWrapper(toggleSavedStoryController),
);

export default userRouter;
