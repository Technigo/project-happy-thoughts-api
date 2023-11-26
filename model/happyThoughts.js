import mongoose from "mongoose";
const { Schema } = mongoose;

export const ThoughtsSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const HappyThoughts = mongoose.model("HappyThoughts", ThoughtsSchema);
