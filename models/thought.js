import mongoose from 'mongoose'

const Thought = mongoose.model('Thought', {
    message: {
      type: String,
      required: true,
      minlength: [5, 'Thought needs to be longer then 5 characters'],
      maxlength: [140, 'This thought is to long']
    },
    hearts: {
      type: Number,
      default: 0
    }
  }
)

export default Thought