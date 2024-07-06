// models/thought.js

const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ['Food', 'Project', 'Home', 'Other'],
  },
  tags: [String],
  userName: {
    type: String,
    default: 'Anonymous',
  },
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
