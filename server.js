import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/post-codealong"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// ### EXAMPLE THOUGHT:
// "message": "Testing January 2021",
// "hearts": 2,
// "createdAt": "2021-01-09T12:59:27.662Z",
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  hearts: {
    type: Number,
    default: () => 0,
  }
})

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world! What made you happy today?')
})

// ======= ENDPOINTS ======= //

// 1: GET /thoughts – will list the most recent 20 thoughts.
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20)
  res.status(200).json(thoughts)
})

// 2: POST /thoughts – allows the user to post to the database.
app.post('/thoughts', async (req, res) => {
  try {
    // Success code – what happens if all goes well. Take the "message" part of the request and save it. 
    // "Likes" will be set to 0 as per the mongoose model definition, and "createdAt" will be created automagically.
    const thought = await new Thought({ message: req.body.message }).save()
    res.status(200).json(thought);

  } catch (error) {
    // If it doesn't go well, do this. Use error variable to post useful message to user.
    res.status(400).json({ message: "Could not post thought. Please make sure your message is between 5–140 characters.", errors: error.errors })
  }
})

// 3: POST like – when a user likes a post.
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    res.status(201).json({ message: "Thought liked successfully." })
  } catch (error) {
    res.status(404).json({
      message: "Couldn't find the ID for the thought.",
      error: error.errors
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
