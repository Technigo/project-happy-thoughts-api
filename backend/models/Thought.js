import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema({
  title: {
    type: String,
  },
  likes: {
    type: Number,
  },
  timestamps: true,
  //     author: {
  //       type: String
  //   }
});

export const ThoughtModel = mongoose.model("thoughts", thoughtSchema);
