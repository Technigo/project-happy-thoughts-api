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

// Defines the port the app will run on
const port = process.env.PORT || 8082
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining the routes
app.get('/', async (req, res) => {
  const {sort} = req.query

  const sortData = (sort) => {
    if (sort === 'dates') {
      return {createdAt:'asc'}
    } else if (sort === 'hearts') {
      return {hearts:'desc'}
    } else {
      return {createdAt: 'desc'}
    }
  }

  let thoughts = await Thought.find().sort(sortData(sort)).limit(20).exec()
  res.json(thoughts)
})

// Retrieve the information sent by the client to our API endpoint
app.post('/', async (req, res) => {
  const {message} = req.body
  const thought = new Thought({message})

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch(err) {
    res.status(400).json({message: 'Could not save task to the Database', error: err.errors})
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  const {thoughtId} = req.params
  try {
    await Thought.updateOne({'_id': thoughtId}, {'$inc': {'hearts': 1}})
    res.status(201).json()
  } catch (err) {
    res.status(400).json({message: 'Could not find the happy thought', error: err.errors})
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})