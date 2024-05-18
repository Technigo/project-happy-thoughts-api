import mongoose from "mongoose";

const { Schema } = mongoose;

export const ThoughtSchema = new Schema({
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
    default: Date.now,
  },
});

// Mongoose model
const Thought = mongoose.model("Thought", ThoughtSchema);
export default Thought;
