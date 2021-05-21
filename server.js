import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message required'],
    minlength: [5, 'Min. length 5 characters'],
    maxlength: [140, 'Max. length 140 characters']
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: 'API unavailable'
    })
  }
})

// shows list of endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// get the 20 latest thoughts, sorted from newest
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(thoughts)
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error })
  }
})

// post new thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.json(newThought)
  } catch (error) {
    res.json(400).json(error)
  }
})

// like a post
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const likeThought = await Thought
      .findOneAndUpdate({ _id: id }, { $inc: { hearts: 1 } }, { new: true })
    if (likeThought) {
      res.status(200).json(likeThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// delete thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// edit thought
app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought
      .findByIdAndUpdate(id, req.body, { new: true })

    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
