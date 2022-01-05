import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://jenquach:Koda2022@cluster0.d5xuu.mongodb.net/project-happy-thoughts--api?retryWrites=true&w=majority"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },  
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// main endpoint
app.get('/', (req, res) => {
  res.send('Hello world')
})

// endpoint that returns the most recent 20 thoughts
app.get('/thoughts', (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec()
    res.json(allThoughts)
  } catch (err) {
    res.status(400).json({ message: 'No thoughts found', error: error.error})
  }
})

// endpoint to post new thoughts
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = new Thought(req.body).save()
    res.status(201).json({ response: newThought, success: true })
  } catch (err) {
    res.status(400).json({ response: error, succes: false})
  }
})

// endpoint to increase likes
app.post('/thoughts/:thoughtId/like', async (req, res) => {
 const { thoughtId } = req.params

 try {
  const updatedLike = await Thought.findByIdAndUpdate(id, { 
    $inc: { 
      heart: 1 
    }
  },
  {
    new: true,
  })
  res.status(201).json({response: updatedLike, success: true})
 } catch (err) {
   res.status(400).json({ response: error, success: false })
 }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
