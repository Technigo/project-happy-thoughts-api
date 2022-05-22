import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/project-happyhappyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service not online' })
  }
})

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: String,
    default: () => new Date(),
  },
})
// createdAt: {
//   type: Date,
//   default: Date.now,
// },

const Thought = mongoose.model('Thought', ThoughtSchema)

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thoughts)
})
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ message }).save()
    res.status(200).json({ respone: newThought, success: true })
  } catch (error) {
    res.status(400).json({ respone: error, success: false })
  }
})
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true },
    )
    res.status(200).json({ respone: updatedThought, success: true })
  } catch (error) {
    res.status(400).json({ respone: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
