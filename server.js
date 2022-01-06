import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  category: {
    type: String,
    enum: ['Personal', 'Weather', 'Food', 'Studies', ''],
    default: ''
  },
  name: {
    type: String,
    default: "anonymous"
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema)

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

mongoose.set('useFindAndModify', false)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// descending order - from newest to oldest
// ascending order - from oldest to newest
app.get('/thoughts', async (req, res) => {
  const {
    page,
    amount,
    pageNum = Number(page),
    amountNum = Number(amount)
  } = req.query
  const thoughts = await Thought.find().sort({ createdAt: -1 })

  if (page && amount) {
    const thoughtsLimited = await Thought.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * amountNum)
      .limit(amountNum)
    res.json({ page_number: pageNum, items_on_page: amountNum, num_of_pages: Math.ceil(thoughts.length / amount), response: thoughtsLimited, success: true })
  } else {
    res.json({ response: thoughts, success: true })
  }
})

app.post('/thoughts', async (req, res) => {
  const { message, category, name } = req.body
  try {
    const newThought = await new Thought({ message, category, name }).save()
    res.status(201).json({
      response: newThought,
      success: true
    })
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false
    })
  }
})
app.get('/thoughts/category/:category', async (req, res) => {
  const { category } = req.params
  const thoughts = await Thought.find({ category: { $regex: category } })
  if (thoughts.length === 0) {
    res.status(404).json({ response: `Sorry, there are no thoughts with this category ${category}`, success: false })
  } else {
    res.status(200).json({ response: thoughts, success: true })
  }
})


app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const updatedLike = await Thought.findByIdAndUpdate(thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    if (updatedLike) {
      res.status(200).json({ response: updatedLike, success: true })
    } else {
      res.status(404).json({ message: 'Id not found', success: false })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid user id', response: error, success: false })
  }
})

app.delete('/thoughts/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedThought = await Thought.findOneAndDelete({
      _id: id
    })
    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true })
    } else {
      res.status(404).json({ response: "Thought not found", success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.patch('/thoughts/:id', (req, res) => {
  const { id } = req.params
  const { message } = req.body

  Thought.findOneAndUpdate({ _id: id }, { message }, { new: true })
    .then((updatedThought) => {
      if (updatedThought) {
        res.status(200).json({ response: updatedThought, success: true })
      } else {
        res.status(404).json({ response: "Thought not found", success: false })
      }
    })
    .catch((error) => {
      res.status(400).json({ response: error, success: false })
    })
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
