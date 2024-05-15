import mongoose from "mongoose";

const { Schema, model } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
    //This way the user can't change the default
    setDefaultsOnInsert: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    //So the date can't be changed after the first setting
    immutable: true,
  },
});

export const Thought = model("Thought", ThoughtSchema);
