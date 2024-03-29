const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [140, 'Message can be no longer than 140 characters']
    },
  
    hearts: {
      type: Number, 
      default: 0, 
    },
    createdAt: {
      type: Date, 
      default: Date.now, 
    }
  });

  module.exports = mongoose.model('Thought', thoughtSchema);