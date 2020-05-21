import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'
import thoughtsData from './data/thoughts.json'

const ERR_COULD_NOT_SAVE_THOUGHT = 'Could not save thought to database'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Created test data to get the database deployed in Mongo Atlas
if (process.env.RESET_DATABASE) {
  console.log('Resetting database ...')

  const seedDatabase = async () => {
    await Thought.deleteMany()
    await thoughtsData.forEach((thought) => new Thought(thought).save())
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

// Get thoughts, sort by createdAt descending order, limit to show 20
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Retreive the information sent by the client to API endpoint, don't include hearts
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  // Use mongoose model to create the database entry, no hearts included
  const thought = new Thought({ message })
  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: ERR_COULD_NOT_SAVE_THOUGHT })
  }
})

// PUT Add hearts to thought, increment by 1. I choose PUT since updating existing data.
app.put('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  const ERR_COULD_NOT_FIND_THOUGHT = `Could not find thought with id ${thoughtId}`
  try {
    const updatedThought = await Thought.updateOne(
      { _id: thoughtId },
      { $inc: { hearts: 1 } }
    )
    res.status(201).json(updatedThought)
  } catch (err) {
    res.status(404).json({ message: ERR_COULD_NOT_FIND_THOUGHT })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
