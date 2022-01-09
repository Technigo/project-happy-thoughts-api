import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // Enables Mongoose to use a not deprecated method instead
})
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date, // Number  - milliseconds
    default: () => new Date(), //() => Date.now() - milliseconds
  },
})

const Thought = mongoose.model('Thought', ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/thoughts', async (req, res) => {
  const {
    sort,
    page,
    perPage,
    sortNum = Number(sort),
    pageNum = Number(page),
    perPageNum = Number(perPage),
  } = req.query

  // The Mongoose way
  const thoughts = await Thought.find({})
    .sort({ createdAt: sortNum }) // 1 or -1 as query for asc/desc
    .skip((pageNum - 1) * perPageNum)
    .limit(perPageNum)

  res.status(200).json({ response: thoughts, success: true })
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ message }).save() // message: message
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const likedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { new: true },
    )
    res.status(200).json({ response: likedThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId })
    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true })
    } else {
      res.status(404).json({ response: 'Thought not found', success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.patch('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params
  const { message } = req.body

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { message },
      { new: true },
    )
    if (updatedThought) {
      res.status(200).json({ result: updatedThought, success: true })
    } else {
      res
        .status(404)
        .json({ response: 'Thought was not found', success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
