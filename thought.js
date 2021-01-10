import mongoose from 'mongoose'

export const Thought = mongoose.model(
  'Thought',
  new mongoose.Schema({
    message: { type: String, required: true, minLength: 5, maxLength: 140 },
    hearts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  })
);
