import { Router } from 'express';
import { getUsersController } from '../controllers/users.js';

const userRouter = Router();

userRouter.get('/', getUsersController);

export default userRouter;
