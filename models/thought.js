import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ThoughtSchema = new Schema({
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
    default: Date.now
  },
  createdBy: {
    type: String,
    maxlength: 14,
    default: 'Anonymous'
  },
  comment_count: {
    type: Number,
    default: 0
  }
})

module.exports = new mongoose.model('Thought', ThoughtSchema)