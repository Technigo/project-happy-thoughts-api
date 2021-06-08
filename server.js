import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message has to be at least 5 characters"],
    maxlength: [140, "Message cannot exceed 140 characters"]
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

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// End point to POST a new thought
app.post('/thoughts', async (req, res) => {
  try {
    const savedThought = await new Thought({ message: req.body.message }).save()
    res.json(savedThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error.message)
  }
})

// End point to DELETE a thought from ID
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not Found' })
    } 
  } catch (error) {
    res.status(400).json({ message: 'invalid request', error })
  }
})

// End point to GET all thoughts
app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
  res.json(allThoughts)  
})

// End point to POST a request to increase hearts from ID
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought
      .findByIdAndUpdate(id, { $inc: { hearts: 1 } }, { new: true })
    res.json(updatedThought)
  } catch (error) {
    res.status(404).json({ message: 'Invalid request', error })
  }
})

// End point to PATCH an update to thought from ID
app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought
      .findByIdAndUpdate(id, { message: req.body.message }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not Found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'invalid request', error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
