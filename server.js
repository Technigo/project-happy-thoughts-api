import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise



// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()


//Mongoose Schema for thought model
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  }
})

//Mongoose model with Schema
const Thought = mongoose.model('Thought', ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})


// Get thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc"})
  res.json(thoughts)
})

// v1 async await
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ message }).save()
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})


app.post('/thoughts/:id/hearts', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought =  await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } })
    res.status(200).json({ response: updatedThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
