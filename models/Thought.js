import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    defualt: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Edporting userSchema all around the project
export const ThoughtModel = mongoose.model("thought", thoughtSchema);
