const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
    message: {
      type: String,
      required: [true, 'A happy thought message is required'],
      minlength: [5, 'The message must be at least 5 character long'],
      maxlength: [140, 'The message cannot be more than 140 characters']
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