import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  comment: {
    type: String
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thought'
  }
})

module.exports = new mongoose.model('Comment', CommentSchema)