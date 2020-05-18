import mongoose from 'mongoose'


// Update this model according to technigo notion project description!
// You should not be able to se the number of hearts when posting a new message
// createdAt should not be able to be modifed when posting a new message
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default Thought