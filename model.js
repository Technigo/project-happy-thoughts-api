import mongoose from 'mongoose'

export const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true
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