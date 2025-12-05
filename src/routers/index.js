import { Router } from 'express';

import storyRouter from './stories.js';
import userRouter from './users.js';

const router = Router();

router.use('/stories', storyRouter);

router.use('/users', userRouter);

export default router;
