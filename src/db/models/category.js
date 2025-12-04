import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { versionKey: false },
);

export const CategoryCollection = model('categories', categorySchema);
