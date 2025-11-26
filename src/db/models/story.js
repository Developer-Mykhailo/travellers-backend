import { Schema, model } from 'mongoose';

const storySchema = new Schema(
  {
    img: { type: String },
    title: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toISOString.split('T')[0];
      },
    },
  },
  { timestamps: true, versionKey: false },
);

export const StoriesCollection = model('stories', storySchema);
