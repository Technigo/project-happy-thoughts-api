import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

const ERR_CAN_NOT_SAVE_THOUGHT = 'Could not save thought to database'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Seed database to test endpoints?

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Get thoughts, sort by createdAt descending order, limit to show 20
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Retreive the information sent by the client to our API endpoint, don't include hearts
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  // Use our mongoose model to create the database entry, no hearts included
  const thought = new Thought({ message })

  try {
    //Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    // Fail
  } catch (err) {
    res.status(400).json({ message: ERR_CAN_NOT_SAVE_THOUGHT })
  }
})

// PUT add hearts to thought, increment by 1
app.put('/thoughts/:thoughtId/like', async (req, res) => {
  const { id } = req.params
  /*  console.log(`PUT /thougts/${id}/like`) */
  await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } })
  res.status(201).json()
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
