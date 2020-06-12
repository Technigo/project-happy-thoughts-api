import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

// DEFAULT SETUP

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// ERROR VARIABLES

const ERR_CANNOT_FIND_ID = 'Thought not found.'
const ERR_CANNOT_SAVE = 'Thought not found.'


// RESET

if (process.env.RESET_DATABASE) {
  const resetDatabase = async () => {
    console.log('reset database')
    await Thought.deleteMany()
  }
  resetDatabase()
}

// ROUTES

// Get 20 thoughts in descending order from when they were created
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Find a thought
app.get('/:id', async (req, res) => {
  const { id } = req.params
  const thought = await Thought.findById(id)
  if (thought) {
    res.status(200).json(thought)
  } else {
    res.status(400).json({ message: ERR_CANNOT_FIND_ID })
  }
})

// Add a thought
app.post('/', async (req, res) => {
  // Retrieve the information sent by the client to the API endpoint
  const { message, createdBy, tag } = req.body

  // Use the created mongoose model to create the database entry
  const thought = new Thought({ message, createdBy, tag })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: ERR_CANNOT_SAVE, error: err.errors })
  }
})

// Like a thought
app.post('/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    await Thought.findOneAndUpdate({ _id: id }, { $inc: { hearts: 1 } })
    res.status(200).json('You liked a thought')

  } catch (err) {
    res.status(400).json({ error: ERR_CANNOT_FIND_ID })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
