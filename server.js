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
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const port = process.env.PORT || 2700
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here

const myEndpoints = require("express-list-endpoints")
app.get('/', (req, res) => {
  res.send(myEndpoints(app))
})

//GET AND POST THOUGHTS
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 1}).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async(req, res) => {
  const {message, hearts} = req.body
  const thought = new Thought({message: message, hearts: hearts})

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: 'Could not save thought to the database', error: err.errors})
  }
})

//MANAGING POST FOR LIKES
app.post('/:IDthought/like', async (req, res) => {
  const {IDthought} = req.params
  const thought = await Thought.findById(IDthought)

  if(thought) {
    thought.hearts++
    thought.save()
    res.status(201).json(thought)
  } else {
    res.status(400).json({
      message: `Sorry! The thought with the ID: ${IDthought} does not exist. Maybe try typing in another ID?`
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
