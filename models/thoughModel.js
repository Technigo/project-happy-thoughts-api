import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: [5, "The message must be at least 5 characters long."],
    maxlength: [140, "The message can't exceed 140 characters."]
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  }
});

export const Thought = mongoose.model("Thought", thoughtSchema);