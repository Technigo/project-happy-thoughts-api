import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  name: {
    type: String,
    default: 'Anonymous',
    maxlength: 15
  },
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

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8041
const app = express()

const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//GET ENDPOINT
//return 20 results ordered by createAt
app.get('/thoughts', async (req, res) => {
  //Alla thoughts den hittar, sorterad på nyast och endast visa de 20 senaste. Vad betyder exec?
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thoughts)
})

//POST THOUGHT ENDPOINT
//validate input and return error
app.post('/thoughts', async (req, res) => {
  const { message, name } = req.body
  const thought = new Thought({ message, name })
  try {
    const saveThought = await thought.save()
    res.status(201).json(saveThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not post thought', error: err.errors })
  }
})

//POST LIKE ENDPOINT
// return error if thought not found
//CHANGE TO PUT
app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    res.status(201).json()
  } catch (err) {
    res.status(404).json({ message: 'Thought not found', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
