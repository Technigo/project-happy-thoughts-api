import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema({
  title: {
    type: String,
  },
});

export const ThoughtModel = mongoose.model("thoughts", thoughtSchema);
