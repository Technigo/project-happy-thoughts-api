import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

//schema which defines the data which is posted to the backend
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: [
      5,
      "Please type in more words",
    ],
    maxlength: [
      140, 
      "Please stop writing; that are enough words."
    ],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },

  hearts: {
    type: Number,
    default: 0,
  },
})

const Thought = mongoose.model('Thought', ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello my dear people out there, this is my API to the happy thought project')
})

// endpoint for users to fetch the most recent 20 thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
    res.status(200).json(allThoughts)
  } catch (error) {
    res.status(404).json({
      message: "Can not find thoughts",
      errors: error.errors,
      success: false,
    })
  }
})

app.post('/thoughts', async (req, res) => {
  const { message, name } = req.body

  try {
    const newThought = await new Thought({ message, name }).save()
    res.status(201).json({ response: newThought, success: true})
  } catch (error) {
    res.status(400).json({ response: error, success: false})
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const likedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    if (likedThought) {
      res.status(201).json(likedThought)
    } else {
      res.status(404).json({ message: "Not found!" })
    }
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Could not add that like to the database",
        error: err.errors,
      })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
