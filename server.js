import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-API"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const { Schema } = mongoose
const thoughtSchema = new Schema({
  text: {
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
const Thought = mongoose.model('Thought', thoughtSchema)


// Start defining your routes here
app.get('/', (req, res) => {
  res.json(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.status(200).json({
      success: true,
      message: "Success",
      response: thoughts
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Not available",
      response: error
    })
  }
})

app.post('/thoughts', async (req, res) => {
  const { text } = req.body
  // const thought = new Thought({ text, complete })
  try {
    const savedThought = await Thought({ text }).save()
    res.status(200).json({
      success: true,
      message: "Thought created successfully",
      response: savedThought
    })
  }
  catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not save created thought',
      response: error
    })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const savedLike = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    res.status(200).json({
      success: true,
      message: "Like posted successfully",
      response: savedLike
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not save like",
      response: error
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
