import { Router } from 'express';

import storyRouter from './stories.js';

const router = Router();

router.use('/stories', storyRouter);

export default router;
