import mongoose from 'mongoose'

const Thought = mongoose.model('Thought', {
  text: {
    type: String,
    required: true,
    minlength: 5,
  },
  like: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default Thought