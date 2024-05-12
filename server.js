import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import expressListEndpoints from 'express-list-endpoints'

dotenv.config()
mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/HappyThoughts'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    maxlength: 140,
    minlength: 5,
  },
  hearts: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find({})
    .sort({ createdAt: 'asc' })
    .limit(20)
    .exec()

  try {
    res.status(201).json(thoughts)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Could not retrieve thoughts.', error: err.errors })
  }
})
app.post('/thoughts', async (req, res) => {
  const { message, heart } = req.body
  const thought = new Thought({ message, heart })
  try {
    const newThought = await thought.save()
    res.status(201).json(newThought)
  } catch (err) {
    res.status(500).json({
      message:
        'Could not save your thought, insert a messagge between 5-140 characters',
      error: err.errors,
    })
  }
})
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  const thought = await Thought.findById(thoughtId)
  try {
    thought.hearts += 1
    const updatedThought = await thought.save()
    res.status(201).json(updatedThought)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'could not like the thought', error: err.errors })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
