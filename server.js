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


//Mongoose Schema for Thought model
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


// Get 20 latest thoughts in descending order
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find({}).sort({ createdAt: 'desc'}).limit(20)
  res.status(200).json({ response: thoughts, success: true })
})

// Post thought message and deletes first entry in DB to not max out DB over time
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ message }).save()
    await Thought.deleteOne({})
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Post for adding likes/hearts
app.post('/thoughts/:id/hearts', async (req, res) => {
  const { id } = req.params

  try {
    const updatedHeart =  await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } })
    if (updatedHeart) {
    res.status(200).json({ response: updatedHeart, success: true })
    } else {
      res.status(404).json({ response: 'Not found', success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})


// Delete Thought by Id
/* app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id })
    if (deletedThought){
      res.status(200).json({ response: deletedThought, success: true })
    } else {
      res.status(404).json({ response: 'Thought not found', success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
}) */

// Patch thought message
/* app.patch('/thoughts/:id', (req, res) => {
  const { id } = req.params
  const { message } = req.body

  try {
    const updatedThought = await Thought.findOneAndUpdate( {_id: id}, { message }, {new: true})
    if (updatedThought){
      res.status(200).json({ response: updatedThought, success: true })
    } else {
      res.status(404).json({ response: 'Thought not found', success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
}) */

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
