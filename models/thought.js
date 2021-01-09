import mongoose from 'mongoose' 

const Thought = new mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: [5, 'Message is too short. Minimum length is 5 characters.'],
    maxlength: [ 140, 'Message is too long. Maximum length is 140 characters.']
  },
  name: {
    type: String,
    maxlength: 30,
    default: "Anonymous"
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
})
export default Thought