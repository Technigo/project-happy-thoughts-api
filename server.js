import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
    default: Date.now
  }
})

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20)

  if (thoughts.length > 0) {
    res.json(thoughts)
  }
  else {
    res.status(404).json({ message: 'No thoughts yet' })
  }
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  }
  catch (err) {
    res.status(400).json({ message: 'Could not save thought to Database', error: err.error })
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  //a thought with a specific id
  const thought = await Thought.findById(thoughtId)

  if (thought) {
    //likes
    thought.hearts++
    thought.save()
    res.status(201).json(thought)
  }
  else {
    res.status(400).json({ message: `${thoughtId} does not exist `})
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
