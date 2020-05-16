import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
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
    default: () => new Date()
  },
  name: {
    type: String,
    default: 'Anonymous',
    minlength: 1,
    maxlength: 30
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const listEndpoints = require('express-list-endpoints')


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Get thoughts
app.get('/thoughts', async (req, res) => {
  const { sort } = req.query

  // Sort thoughts based on sort query
  const sorting = (sort) => {
    if (sort === 'likes') {
      return { hearts: -1 }
    } else if (sort === 'date_asc') {
      return { createdAt: 'asc' }
    } else {
      return { createdAt: 'desc' }
    }
  }

  // Apply sorting & set limit to 20
  const thoughts = await Thought.find()
    .sort(sorting(sort))
    .limit(20)
    .exec()

  res.json(thoughts)
})

// Post new Thought
app.post('/thoughts', async (req, res) => {
  // Retrieve information from client to endpoint
  const { message, name } = req.body

  // Create DB entry
  const thought = new Thought({ message, name })

  try {
    // Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the database', error: err.errors })
  }
})

// Like thought
app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    // Success – update thought by id & increment hearts value w/ 1
    await Thought.updateOne({ '_id': thoughtId }, { '$inc': { 'hearts': 1 } })
    res.status(201).json()
  } catch (err) {
    res.status(404).json({ message: 'Thought not found', error: err.errors })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
