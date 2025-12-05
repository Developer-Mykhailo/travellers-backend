import { Router } from 'express';

import {
  addStoryController,
  getStoriesController,
} from '../controllers/stories.js';

const storyRouter = Router();

storyRouter.get('/', getStoriesController);

storyRouter.post('/', addStoryController);

export default storyRouter;
