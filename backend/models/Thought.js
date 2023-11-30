import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema(
  {
    title: {
      type: String,
    },
    likes: {
      type: Number,
    },

    //     author: {
    //       type: String
    //   }
  },
  {
    timestamps: true,
  }
);

export const ThoughtModel = mongoose.model("thoughts", thoughtSchema);
