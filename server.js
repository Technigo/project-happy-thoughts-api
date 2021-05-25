import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndexes: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => Date.now
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

app.use(cors())
app.use(express.json())

app.use((_, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service not available' })
  }
})

app.get('/', (_, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (_, res) => {
  try {
    const everyThought = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(everyThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.json(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { id } = req.params

  try {
    const newLike = await Thought.findByIdAndUpdate({ id }, {$inc: {hearts: 1} })
    if (newLike) {
      res.json(newLike)
    } else {
      res.status(404).json({ message: 'Not found' })
    } 
  } catch (error) {
      res.status(400).json({ message: 'invalid request', error })
  }})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
