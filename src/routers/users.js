import { Router } from 'express';
import {
  getUserByIdController,
  getUsersController,
} from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';

const userRouter = Router();

userRouter.get('/', ctrlWrapper(getUsersController));

userRouter.get('/:id', isValidId, ctrlWrapper(getUserByIdController));

export default userRouter;
