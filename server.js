import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Seed database to test endpoints

// Hearts should not be assignable when adding a new thought, how to fix?
const Thought = mongoose.model('/thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Get thoughts, sort by createdAt descending order, limit to show 20
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Retreive the information sent by the client to our API endpoint
app.post('/thoughts', async (req, res) => {
  const { message, hearts } = req.body
  // Use our mongoose model to create the database entry
  const thought = new Thought({ message, hearts })

  try {
    //Success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
    // Fail
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to database', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
