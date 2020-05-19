import mongoose from 'mongoose'

const Thought = mongoose.model('/thought', {
  /*   _id: {
      type: String,
    }, */
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
export default Thought