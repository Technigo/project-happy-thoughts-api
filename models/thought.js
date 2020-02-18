import mongoose from 'mongoose'

export const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 140
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})