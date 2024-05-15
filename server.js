import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
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
  res.send('Hello Technigo!')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thought(req.body).save()
    res.status(200).json(thought)
  } catch (error) {
    res
      .status(400)
      .json({ errors: error.errors, message: 'Could not save the new message' })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  const likedThought = await Thought.findById(thoughtId)

  try {
    if(likedThought)
    likedThought.hearts ++
    const updatedThought = await likedThought.save()
    res.status(201).json(updatedThought)
    
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
