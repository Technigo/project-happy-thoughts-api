import mongoose from "mongoose";

const { Schema, model } = mongoose;

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
    required: false,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

const Thought = model("Thought", thoughtSchema);

export default Thought;
