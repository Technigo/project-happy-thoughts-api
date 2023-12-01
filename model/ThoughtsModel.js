import mongoose from "mongoose";

const { Schema } = mongoose;

export const ThoughtSchema = new Schema(
  {
    thought: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 140,
    },
    heart: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ThoughtsModel = mongoose.model("Thought, ThoughtSchema");
