import mongoose from 'mongoose'

const Thought = mongoose.model('Thought', {
  message: { type: String, requiered: true, minlength: 5, maxlength: 140 },
  hearts: { type: Number },
  createdAt: { type: Date, default: Date.now }
})

export default Thought
