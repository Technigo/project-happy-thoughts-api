import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
  },
  heart: {
    type: Number,
    required: true,
  },

  timestamps: true,
});

// Edporting userSchema all around the project
export const ThoughtModel = mongoose.model("thought", thoughtSchema);
