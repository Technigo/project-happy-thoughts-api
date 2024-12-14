import mongoose from "mongoose";

// Define the Thought schema
const ThoughtSchema = new mongoose.Schema({
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
});

// Export the Thought model
export const Thought = mongoose.model("Thought", ThoughtSchema);
n