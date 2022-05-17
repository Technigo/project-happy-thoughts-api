import mongoose from "mongoose";
import { happyThoughts } from "./modelNames.js";

const happySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 140,
    },
    hearts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const HappyThought = mongoose.model(happyThoughts, happySchema);

export default HappyThought;
