import mongoose from "mongoose";

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: [5, "Message to short"],
    maxlength: [140, "Message to long"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default Thought;
