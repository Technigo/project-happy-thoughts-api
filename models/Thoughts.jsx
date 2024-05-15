import mongoose from "mongoose";

const { Schema, model } = mongoose;

const thoughtSchema = new Schema({
  message: {
    // If a message shorter than 5 or longer than 140 characters is written, it will not pass as valid
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  createdAt: {
    // If sometihing other than the date now is written, it doesn't affect it, since the default is Date.now
    type: Date,
    default: Date.now,
    required: false,
  },
  hearts: {
    // If sometihing other than hearts 0 is written, it doesn't affect it, since the default is 0
    type: Number,
    default: 0,
    required: false,
  },
});

const Thought = model("Thought", thoughtSchema);

export default Thought;
