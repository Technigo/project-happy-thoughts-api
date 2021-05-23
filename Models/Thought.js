import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A message is needed'],
      minlength: 5,
      maxlength: 140
    },
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    hearts: {
      type: Number,
      default: 0
    }
  }
)
const Thought = mongoose.model("Thought", messageSchema)

module.exports = Thought