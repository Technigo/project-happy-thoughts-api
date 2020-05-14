import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minLenght: 5,
    maxLenght: 140,
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const listEndpoints = require('express-list-endpoints')

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})


//Get the 20 latest thoughts route
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts)
})

// Post new message 
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: 'Sorry, could not post this', error: err })
  }
})

// Post hearts to a specific message
app.post('/:thougthId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findOneAndUpdate({ '_id': thoughtId }, { $inc: { 'hearts': 1 } });
    res.json(thought).status(201);
  } catch (err) {
    res.status(401).json({ message: 'Heart not added to post', error: err })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
