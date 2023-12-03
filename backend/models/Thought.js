import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 140,
    },
    hearts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },

    //     author: {
    //       type: String
    //   }
  }
  // {
  //   timestamps: true,
  // }
);

export const ThoughtModel = mongoose.model("thoughts", thoughtSchema);
