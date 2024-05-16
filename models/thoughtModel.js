import mongoose from "mongoose";

const { Schema } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date(),
    default: () => new Date(),
  },
});

export const Thought = mongoose.model("Thought", thoughtSchema);

// Should not be assignable when creating a new thought
