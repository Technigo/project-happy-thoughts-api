import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const ThoughtSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   minlenght: 2,
  //   maxlength: 20,
  //   trim: true
  // },
  text: {
    type: String,
    required: true,
    minlenght: 5,
    maxlength: 140,
    trim: true
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  },
  likes: {
    type: Number,
    default: 0
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema) 



// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const { name, text } = req.body

  const thought = new Thought({name, text})

  try {
    const newThought = await thought.save()
    res.status(201).json({ response: newThought, sucess: true })
  } catch (err) {
     res.status(400).json({ message: 'Could not save thought to the Database', success: false })
  }
})

app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params

  try {
    const thought = await Thought.findByIdAndUpdate(
      id,
      { $inc: 
        { likes: 1 } },
      { 
        new: true 
      }
    )
    res.status(200).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not find thought', errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
