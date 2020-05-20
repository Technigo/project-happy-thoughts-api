import mongoose from 'mongoose'

const Thought = mongoose.model('Thought', {
    message: {
      type: String,
      required: true,
      minlength: [5, 'Thought needs to be longer then 5 characters'],
      maxlength: [140, 'This thought is to long']
    },
    likes: {
      type: Number,
      default: 0
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now // Or new Date()?
    }
  }
)

export default Thought