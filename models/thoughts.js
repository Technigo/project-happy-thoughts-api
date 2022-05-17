import mongoose from "mongoose";

const ThoughtsSchema = mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

module.exports = mongoose.model("Thoughts", ThoughtsSchema);