import { Router } from 'express';

import {
  addStoryController,
  getStoriesController,
  getStoryByIdController,
} from '../controllers/stories.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';

const storyRouter = Router();

storyRouter.get('/', ctrlWrapper(getStoriesController));

storyRouter.get('/:id', isValidId, ctrlWrapper(getStoryByIdController));

storyRouter.post('/', addStoryController);

export default storyRouter;
