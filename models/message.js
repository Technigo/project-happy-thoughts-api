import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
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
      default: Date.now()
    }
  }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message