import { Router } from 'express';
import {
  deleteAvatarController,
  getUserByIdController,
  getUserProfileByIdController,
  getUsersController,
  toggleSavedStoryController,
  updateUserInfoController,
  uploadAvatarController,
} from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema } from '../validation/users.js';

const userRouter = Router();

userRouter.get('/', ctrlWrapper(getUsersController));

userRouter.get('/public/:id', isValidId, ctrlWrapper(getUserByIdController));

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

userRouter.delete(
  '/delete-avatar',
  authenticate,
  ctrlWrapper(deleteAvatarController),
);

userRouter.post(
  '/update-info',
  authenticate,
  validateBody(createUserSchema),
  ctrlWrapper(updateUserInfoController),
);

export default userRouter;
