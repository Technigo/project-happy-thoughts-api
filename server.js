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
  res.send('Hello world')
})

// GET routes

// post route
app.post('/thoughts', async (req, res) => {
  // send a request body in order to pass information into the API
  // if a lot of values (which I'll have) create const

  // Van shortens this around 13 min into the video
  try {
    // success case
    const NewMessage = new Message({ message: req.body.message })
    const savedMessage = await NewMessage.save()
    res.json(savedMessage)
  } catch (err) {
    // notify the client that attempt to post was unsuccessful
    res.status(400).json({ message: "could not save message", errors: err.errors })
  }
})

// DELETE in the database by ID
// this is the path to the ID (which I have not created yet...)
app.delete('/thoughts/:thoughtId', async (req, res) => {

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
