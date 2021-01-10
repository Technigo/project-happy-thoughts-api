import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
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

// Get thoughts
app.get('/thoughts', async (req, res) => {
  const getThoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(getThoughts)
})

// Post a new thought
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  
  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {    
      console.log(err)
      res.status(400).json({ message: 'Could not save message to the Database', error: err.errors })
    }
})

// Post like on withthoughtId
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    await Thought.updateOne({ _id: req.params.thoughtId}, {$inc: {hearts: 1}})
    res.status(200).json({ success: true })
  } catch (err) {
      console.log(err)
      res.status(400).json({ success: false , error: err.errors })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
