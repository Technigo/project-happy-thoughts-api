import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: [5, "Please type a message with min 5 characters"],
    maxlength: [140, "Please type a message with max 140 characters"],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ThoughtModel = mongoose.model("Thoughts", thoughtSchema);
