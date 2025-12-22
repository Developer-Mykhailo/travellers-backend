import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    description: {
      type: String,
      default: 'Hello everyone, I am happy to share my stories.',
    },
    savedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'stories',
      },
    ],
    publicStories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'stories',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserCollection = model('users', userSchema);
