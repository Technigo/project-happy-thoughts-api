import mongoose from 'mongoose'

const Thought = mongoose.model('Thought', {
    message: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 140
    },
    likes: {
      type: Number,
      default: 0
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
)

export default Thought