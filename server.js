import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
mongoose.set('useFindAndModify', false)

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
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

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// The Routes!
app.get('/', (req, res) => {
  res.send('Hello and welcome to my happy thoughts API 🎉')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save the thought 😔', errors: err.errors})
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    await Thought.updateOne({ _id: req.params.thoughtId }, {$inc: { hearts: 1 } })
    res.status(200).json()
  } catch (err) {
    res.status(400).json({ message: 'Sorry, could not like this thought 😔 : not existing', errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})