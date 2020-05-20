import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    maxlength: 14,
    default: 'Anonymous'
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: 'Thought'
  }
})

module.exports = new mongoose.model('Comment', CommentSchema)