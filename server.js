import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message has to be 5 characters or more"],
    maxlength: [140, "Message has to be less than 140 characters"]
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

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy thoughts!')
})

//Endpoint thats shows list with maximum of 20 thougths
app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find()
    .sort({ createdAt: '1' })
    .limit(20)
    res.json(thoughts)
})

//Endpoint to post a thought
app.post('/thoughts', async (req, res) => {
  try {
    const addThought = await new Thought(req.body).save()
    res.json(addThought)
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error })
  }
})

//Endpoit to like a thought
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Message not found' })
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