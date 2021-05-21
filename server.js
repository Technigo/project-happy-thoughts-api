import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Message = mongoose.model('Message', {
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

app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello hello world')
})

// Route that displays all messages, sorted by newest first, limited to 20 msgs
app.get('/thoughts', async (req, res) => {
  const thoughts = await Message.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Route to post a new message
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const thought = await new Message({ message }).save()
    res.status(201).json(thought)
  } catch (error) {
    res.status(400).json({ data: 'Could not save message', error: error.errors })
  }
})

// Route to like a message, i.e. increase heart count by 1
app.post('/thoughts/:id/hearts', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Message.findByIdAndUpdate(id, { $inc: { hearts: 1 } })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ data: 'Mgs not found' })
    }
  } catch (error) {
    res.status(400).json({ data: 'Invalid request' })
  }
})

// Route to delete a message
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Message.findOneAndDelete({ _id: id })
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ data: 'Msg not found' })
    }
  } catch (error) {
    res.status(400).json({ data: 'Invalid request', error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
