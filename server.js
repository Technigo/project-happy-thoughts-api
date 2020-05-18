import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// MODEL
const Thought = mongoose.model('Thought', {
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
    default: Date.now()
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: -1 }).limit(20).exec()
  console.log(thoughts)
  if (thoughts.length > 0) {
    res.json(thoughts)
  } else {
    res.status(404).json({message: "No thoughts!"})
  }
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({message})

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(404).json({message: 'Could not save thought to the Database', error: err.errors})
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  const id = req.params.thoughtId

  try {
    const likedThought = await Thought.findById(id)
    likedThought.hearts += 1
    likedThought.save()
    res.status(201).json(likedThought)
  } catch (err) {
    res.status(404).json({message: `No thought with matching ID: ${id}`, error: err.errors})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
