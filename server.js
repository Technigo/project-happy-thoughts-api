import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// MODEL FOR THOUGHT
const Thought = mongoose.model('Thought', {
  message: { type: String, requierd: true, minlength: 5, maxlength: 140 },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

// PORT & APP SETUP
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// THOUGHTS
app.get('/', async (req, res) => {
  // Returning 20 thoughts order by last created first
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

app.post('/', (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  try {
    //Sucess
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    // Failed
    res.status(400).json({ message: 'Could not send thought', error: err.errors })
  }
})

app.post('/:thoughtId/like', (req, res) => {
  const { thoughtId } = req.params
  const thought = await Thought.findById(thoughtId)

  if (thought) {
    thought.heart += 1
    thought.save()
    res.json(thought)
  } else {
    res.status(404).json({ message: 'Could not find thought', error: err.errors })

  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
