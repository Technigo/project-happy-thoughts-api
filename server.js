import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// created Schema for thoughts, with some validation
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String, 
    required: [true, 'Message is required!'],
    minlength: [5, 'Thought must be a minimum 5 characters!'],
    maxlength: [140, 'Thought must be a maximum 140 characters!'],
    trim: true
  }, 
  hearts: {
    type: Number, 
    default: 0
  }, 
  createdAt: {
    type: Date, 
    default: Date.now
  },
  userName: {
    type: String,
    default: 'Anonymous',
    maxlength: [20, 'userName must be a maximum 20 characters!']
  }
})

const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// GET endpoint to retrieve all thoughts from the database. 
// Sorted by date from newest to oldest. 
// Mongoose methods instead of using aggregate to skip, sort, limit
app.get('/thoughts', async (req, res) => {
  const page = Number(req.query.page)
  const perPage = Number(req.query.perPage)

  const newThought = await Thought.find()
    .skip((page - 1) * perPage)
    .sort({ createdAt: -1 })
    .limit(perPage)
    .exec()
  res.json(newThought)
})

// POST endpoint that allows us to add thoughts and username to the database
app.post('/thoughts', async (req, res) => {
  const { message, userName } = req.body
  try {
    const newThought = await new Thought({ message, userName: userName || 'Anonymous' }).save()
    res.json(newThought)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Post endpoint to increase number of likes
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params 

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { 
        _id: id 
      }, 
      { 
        // $inc - specific query selector for increasing amounts of likes
        // it's purpose is to update the numbers value 
        $inc: { hearts: 1 } 
      }, 
      { 
        new: true 
      }
    ) 
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Delete endpoint to be able to delete thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params 

  try {
    const deletedThought = await Thought.findByIdAndDelete(id)
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {})
