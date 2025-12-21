import { Router } from 'express';
import {
  getUserByIdController,
  getUserProfileByIdController,
  getUsersController,
  toggleSavedStoryController,
  uploadAvatarController,
} from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.get('/', ctrlWrapper(getUsersController));

userRouter.get('/:id', isValidId, ctrlWrapper(getUserByIdController));

userRouter.get(
  '/profile/:id',
  isValidId,
  authenticate,
  ctrlWrapper(getUserProfileByIdController),
);

userRouter.patch(
  '/toggle-save-story/:id',
  authenticate,
  isValidId,
  ctrlWrapper(toggleSavedStoryController),
);

userRouter.post(
  '/upload-avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(uploadAvatarController),
);

export default userRouter;
