import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
/* import dotenv from 'dotenv'

dotenv.config() */

const port = process.env.PORT || 8080
const app = express()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
    message: "Numbers are not allowed"
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String
  },
  hashtag: {
    type: String
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Welcome to Sandras happy thoughts API!')
})

app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
  res.json(allThoughts)
})

app.get('/thoughts/category/:tag', async (req, res) => {
  const { tag } = req.params

  try {
    const thoughtsByCategory = await Thought.find({ hashtag: tag })
    res.json(thoughtsByCategory)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

app.get('/thoughts/user/:name', async (req, res) => {
  const { name } = req.params

  try {
    const thoughtsByUser = await Thought.find({ user: name })
    res.json(thoughtsByUser)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

app.post('/thoughts', async (req, res) => {
  let tag

  if (req.body.hashtag.charAt(0) === '#') {
    tag = req.body.hashtag.slice(1) 
  } else {
    tag = req.body.hashtag
  }

  try {
    const newThought = await new Thought({ message: req.body.message, user: req.body.user, hashtag: tag }).save()
    res.json(newThought)
  } catch (error) {
    res.status(400).json(error)
  } 
})

app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.json(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findByIdAndDelete(id) 
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.json(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, req.body, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.put('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
