import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts2"
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
  },
})


//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Get the 20 most recent thoughts
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Send a new thought
app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({
    message: message,
  })
  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save happy thought to database', error: err.errors })
  }
})

// Like a thought
app.post('/:id/like', async (req, res) => {
  try {
    const savedLike = await Thought.findOneAndUpdate(
      { _id: req.params.id }, { $inc: { hearts: 1 } }
    )
    res.json(savedLike)
  } catch (err) {
    res.status(400).json({ message: 'Could not like, thought not found', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
