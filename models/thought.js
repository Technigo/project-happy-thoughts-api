import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  theme: {
    type: String,
    default: "❤️",
  },
  hearts: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: "Anonymous",
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("Thought", thoughtSchema);
