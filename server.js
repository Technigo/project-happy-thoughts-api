import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import expressListEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.send(endpoints)
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thoughts)
})

app.get('/thoughts/:id', async (req, res) => {
  const thought = await Thought.findOne({ _id: req.params.id })
  if (thought) {
    res.json(thought)
  } else {
    res.status(404).json({
      error:
        'Could not find a thought with this id, the ids can be found in the endpoint /thoughts and look like this: 6644ba986567997e623591fb',
    })
  }
})

app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thought({
      message: req.body.message,
    }).save()
    res.status(200).json(thought)
  } catch (error) {
    res
      .status(400)
      .json({ errors: error.errors, message: 'Could not save the new message' })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const newLike = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { new: true }
    )
    res.status(201).json(newLike)
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: 'Thought could not be updated with a new like',
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
