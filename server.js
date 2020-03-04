import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { Thought } from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughtsMONGOAPI"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// My routes
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  if (thoughts) {
    res.status(200).json(thoughts)
  } else {
    res.status(400).json({ message: 'Could not find thoughts', error: err.errors })
  }
})

app.get('/:thougthId', async (req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOne({ '_id': thoughtId })
  .then ((results) => {
    res.json(results)
  })
})
// POST thoughts to page
app.post('/', async (req, res) => {
    try {
    const { message } = req.body
    const thought = await new Thought({ message }).save()
    res.status(200).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not post thought', error: err.error })
  }
})

// POST likes to page
app.post('/:thoughtId/likes', async (req, res) => {
  const { thoughtId } = req.params
  try {
    await Thought.updateOne({'_id': thoughtId }, {$inc: {likes: 1}})
    res.status(201).json({})
  } catch (err) {
    res.status(400).json({ message: 'Could not add like'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
