import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// post model 
const Message = mongoose.model('post', {
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  hearts: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: "Anonymous"
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

// server ready
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).send({ error: 'service unavailable' })
  }
})

// GET endpoints
const listEndpoints = require('express-list-endpoints')
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// GET Messages routes
app.get('/thoughts', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec()
    res.status(200).json(messages)
  } catch (error) {
    res.status(400).json({ message: "could not find messages", errors: err.errors })
  }
})

// POST Message route
app.post('/thoughts', async (req, res) => {
  // send a request body in order to pass information into the API
  try {
    // success case
    const NewMessage = new Message({ message: req.body.message, name: req.body.name })
    const savedMessage = await NewMessage.save()
    res.status(200).json(savedMessage)
  } catch (err) {
    // Bad request - notify the client that attempt to post was unsuccessful
    res.status(400).json({ message: "could not save message", errors: err.errors })
  }
})

// POST hearts 
app.post('/thoughts/:id/like', async (req, res) => {
  try {
    const { id } = req.params
    await Message.updateOne({ _id: id }, { $inc: { hearts: 1 } })
    res.status(200).send()
  } catch (error) {
    res.status(404).json({ error: 'No thought found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
