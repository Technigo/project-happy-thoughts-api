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
  },
  name: {
    type: String,
    required: false,
    default: "anonymous",
    minlength: 2,
    maxlength: 50
  }
})

//   PORT=9000 npm start
const port = process.env.PORT || 8000
const app = express()

// MIDDLEWARES to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// if database not connected
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// ROUTES
app.get('/', async (req, res) => {
  let thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  if (thoughts) {
    res.status(200).json(thoughts)
  } else {
    res.status(404).json({ message: "Sorry, no thoughts found", error: err.errors })
  }
  res.json(thoughts)
})

// POST 
app.post('/', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const { message, name } = req.body
  // Use our mongoose model to create the database entry
  const thought = new Thought({ message, name })

  try {
    //success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: "Could not save thought to the database", error: err.errors })
  }
})

app.post('/thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    // https://docs.mongodb.com/manual/reference/operator/update/inc/
    await Thought.updateOne({ '_id': thoughtId }, { '$inc': { 'hearts': 1 } })
    res.status(201).json()
  } catch (err) {
    res.status(404).json({ message: `Cannot like the thought with this id ${thoughtId}`, error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
