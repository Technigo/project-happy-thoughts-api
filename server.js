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
  heart: { 
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: Date.now
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy thoughts API!')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

// POST/thoughts
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Sorry, could not save thought to the database', error: err.errors })
  }
})

// POST/thoughts/:thoughtId/like
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = reg.param
    const updatedLike = await Thought.updateOne({ _id: thoughtId }, { $inc: { 'hearts': 1 } })
    res.status(201).json(updatedLike)
  } catch (err) {
    res.status(400).json({ message: 'Sorry, could not find thought', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
