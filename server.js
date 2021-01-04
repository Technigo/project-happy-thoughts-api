import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// server ready


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
  // name: {
  //   type: String,
  //   default: "Anonymous"
  // }
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

// GET endpoints
// const listEndpoints = require('express-list-endpoints')
app.get('/', (req, res) => {
  res.send('Hello world')
  // res.send(listEndpoints(app))
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

// post Message route
app.post('/thoughts', async (req, res) => {
  // send a request body in order to pass information into the API
  // if a lot of values (which I'll have) create const

  // Van shortens this around 13 min into the video
  try {
    // success case
    const NewMessage = new Message({ message: req.body.message })
    const savedMessage = await NewMessage.save()
    res.status(200).json(savedMessage)
  } catch (err) {
    // Bad request - notify the client that attempt to post was unsuccessful
    res.status(400).json({ message: "could not save message", errors: err.errors })
  }
})

// Add hearts 
app.post('/thoughts/:id/like', async (req, res) => {
  try {
    const { id } = req.params
    await Message.updateOne({ _id: id }, { $inc: { hearts: 1 } })
    res.status(200).send()
  } catch (error) {
    res.status(404).json({ error: 'No thought found' })
  }
})

// DELETE in the database by ID
app.delete('/thoughts/:id', async (req, res) => {

  try {
    // try to delete the user
    await Message.deleteOne({ _id: req.params.id })
    // send a successful response
    res.status(200).json({ success: true })
  } catch (error) {
    // this console.log is ok to save for troubleshooting 
    console.log(error)
    // notify the client that attempt to delete was unsuccessful
    res.status(400).json({ success: false })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
