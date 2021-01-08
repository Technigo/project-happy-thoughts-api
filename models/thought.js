import mongoose from 'mongoose'

const Thought = new mongoose.model('Thought', {
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default Thought
