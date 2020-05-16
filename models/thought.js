import mongoose from 'mongoose'

const thoughtSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 140
    },
    hearts: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    name: {
      type: String,
      default: 'Anonymous',
      minlength: 1,
      maxlength: 30
    }
  }
)

module.exports = mongoose.model('Thought', thoughtSchema)