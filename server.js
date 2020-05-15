import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Create Thought with type and requirements
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
// app.get('/', (req, res) => {
//   res.send('Happy Thoughts Project 💌')
// })

app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()

  if (thoughts) {
    res.status(200).json(thoughts)
  } else {
    res.status(400).json({ message: 'Could not post your thought', error: err.errors })
  }
})

app.post('/', async (req, res) => {
  const { message } = req.body

  try {
    const thought = await new Thought({ message }).save()
    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
