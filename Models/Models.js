import mongoose from 'mongoose'

export const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    minlength: 5,
    maxlength: 140
  },
  name: {
    type: String,
    default: "Anonymous"
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: String,
  }
}, "thoughts")