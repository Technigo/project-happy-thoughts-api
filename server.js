import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, {
  useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.Promise = Promise

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
  res.send('Hello world')
})

// Endpoint returning 20 thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
  res.json(thoughts)
})

// Endpoint expecting a JSON body with the thought message
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const thought = await new Thought({ message }).save()
    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', errors: err.errors })
  }

})

// Endpoint taking in _id as params, updating hearts property to add one heart
app.post('/thoughts/:_id/like', async (req, res) => {
  const { _id } = req.params

  const thoughtLiked = await Thought.findOneAndUpdate(
    { _id },
    { $inc: { hearts: 1 } },
    { new: true }
  )

  res.json(thoughtLiked)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
