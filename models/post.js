import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
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
    name: {
      type: String,
      default: "anonymous",
      minlength: 2,
      maxlength: 50
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post