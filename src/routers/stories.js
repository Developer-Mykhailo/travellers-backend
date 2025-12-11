import { Router } from 'express';

import {
  addStoryController,
  getStoriesController,
  getStoryByIdController,
} from '../controllers/stories.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createStorySchema } from '../validation/stories.js';
import { authenticate } from '../middlewares/authenticate.js';

const storyRouter = Router();

storyRouter.get('/', ctrlWrapper(getStoriesController));

storyRouter.get('/:id', isValidId, ctrlWrapper(getStoryByIdController));

storyRouter.post(
  '/',
  authenticate,
  validateBody(createStorySchema),
  ctrlWrapper(addStoryController),
);

export default storyRouter;
