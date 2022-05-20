import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts-api'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8090
const app = express()

app.use(cors())
app.use(express.json())

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A message is required.'],
    minLength: [5, 'The message must be at least 5 characters.'],
    maxLength: [140, 'The message can have a maximum of 140 characters.'],
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
    default: () => new Date().toLocaleTimeString('se-SE'),
  },
})

const Thought = mongoose.model('Thought', ThoughtSchema)

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec()
    res.status(200).json(thoughts)
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: 'Bad request, could not fetch thoughts.',
      error: err.errors,
    })
  }
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({
      message: message,
    }).save()
    res.status(200).json({ response: newThought, success: true })
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: 'Bad request, could not save this new thought.',
      error: err.errors,
    })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const thoughtToLike = await Thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1 },
    })
    res.status(200).json({
      response: `Like ${thoughtToLike.message} has been updated`,
      success: true,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: 'Bad request, could not find and update this thought.',
      error: err.errors,
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
