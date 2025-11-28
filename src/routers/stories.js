import { Router } from 'express';

import { getStoriesController } from '../controllers/stories.js';

const storyRouter = Router();

storyRouter.get('/', getStoriesController);

export default storyRouter;
