import mongoose from 'mongoose'

export const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    minlength: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hearts: {
    type: Number,
    default: 0

  }
}) 