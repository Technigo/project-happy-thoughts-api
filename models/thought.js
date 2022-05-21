import mongoose from "mongoose";

const thoughtSchema = mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please add text"],
    minLength: [5, "Must be at least 5 characters"],
    maxLength: [140, "Max 140 characters"],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("Thought", thoughtSchema);
