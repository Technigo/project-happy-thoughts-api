import mongoose, { mongo } from 'mongoose';

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    min: 5,
    max: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

module.exports = new mongoose.model('Thought', thoughtSchema);
