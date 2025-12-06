import { Router } from 'express';
import {
  getUserByIdController,
  getUsersController,
} from '../controllers/users.js';

const userRouter = Router();

userRouter.get('/', getUsersController);

userRouter.get('/:userId', getUserByIdController);

export default userRouter;
