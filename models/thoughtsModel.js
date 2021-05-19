import mongoose from 'mongoose';

const { Schema } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Message is a required field'],
    minlength: [5, 'Message must be at least 5 characters'],
    maxlength: [140, 'Message must be at most 140 characters']
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: {
      values: ['Happy', 'Food', 'Home', 'Project'],
      message: '{VALUE} is not a supported category'
    },
    default: 'Happy'
  }
});

export default mongoose.model('Thought', thoughtSchema);
