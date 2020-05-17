import mongoose from "mongoose";

const Thought = mongoose.model('Thought', {
  name: {
    type: String,
    default: null,
    minlength: [2, "At least 2 characters"],
    maxlength: [20, "Max 20 characters"],
  },
  message: {
    type: String,
    required: true,
    minlength: [5, "Message to short"],
    maxlength: [140, "Message to long"],
  },
  tag: {
    type: String,
    enum: ["thought", "joke", "wisdom"],
    default: "thought",
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

export default Thought