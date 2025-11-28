import { Schema, model } from 'mongoose';

const storySchema = new Schema(
  {
    img: { type: String },
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Азія',
        'Гори',
        'Європа',
        'Америка',
        'Африка',
        'Пустелі',
        'Балкани',
        'Кавказ',
        'Океанія',
      ],
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        return now.toISOString.split('T')[0];
      },
    },
    favoriteCount: { type: Number },
  },
  { timestamps: true, versionKey: false },
);

export const StoriesCollection = model('stories', storySchema);
