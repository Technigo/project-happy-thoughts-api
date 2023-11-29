import mongoose from "mongoose";

const Thought = mongoose.model('Thought', {
   
    message: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 140
    },
    hearts: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  export default Thought;