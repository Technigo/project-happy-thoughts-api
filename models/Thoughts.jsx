import mongoose from "mongoose";

const { Schema, model } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  hearts: {
    type: Number,
    default: 0,
    required: false,
  },
});

const Thought = model("Thought", thoughtSchema);

export default Thought;
