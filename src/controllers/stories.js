import { StoriesCollection } from '../db/models/story.js';

export const getStoriesController = async (req, res) => {
  const data = await StoriesCollection.find();

  res.json({
    status: 200,
    message: 'Successfully found stories',
    data,
  });
};
