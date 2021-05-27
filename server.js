import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Defines the port the app will run on. 
const port = process.env.PORT || 8082
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140
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

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Lists all endpoints
app.get('/', (_, res) => {
  res.send(listEndpoints(app))
})

// Endpoint that show thoughts with a limit on 20 thoughts per page
app.get('/thoughts', async (_, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Endpoint for posting thoughts
app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body
    const newThought = await new Thought({ message }).save()
    res.json(newThought)
  } catch (error) {
    if (error.errors.message.name === "ValidatorError") {
      res.status(400).json({ error: "Your Thought can't be shorter than 5 characters or longer than 140 characters" })
    }
    res.status(400).json({ error: "Something went wrong" })
  }
})

// Endpoint for likes
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedThought = await Thought.findOneAndUpdate({ _id: thoughtId }, { $inc: { hearts: 1 } }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(404).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => { })
