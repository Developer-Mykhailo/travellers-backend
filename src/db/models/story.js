import { Schema, model } from 'mongoose';
// eslint-disable-next-line
import { UserCollection } from './users.js';

const storySchema = new Schema(
  {
    img: {
      type: Object,
      url: String,
      publicId: String,
    },
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
      },
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export const StoriesCollection = model('stories', storySchema);
