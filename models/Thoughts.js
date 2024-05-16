import mongoose from "mongoose"

//Schema - the blueprint
const { Schema, model } = mongoose

const happyThoughtsSchema = new Schema({
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
  }
})

//Model
const HappyThought = model("HappyThought", happyThoughtsSchema)


export default HappyThought