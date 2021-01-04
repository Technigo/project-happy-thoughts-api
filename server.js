import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: [true, 'Message required]'],
    minLength: [5, 'Too short message, minimum 5 characters'],
    maxLength: [140, 'Too long message, maximum 140 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
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
const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy thoughts API')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ created: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const newThought = new Thought({ message: req.body.message })
  try {
    const savedThought = await newThought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save message', error: err.errors })
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  try {
    const updatedThought = await Thought.updateOne({ _id: req.params.id }, { $inc: { 'hearts': 1 } }, { new: true })
    res.status(201).json(updatedThought)
  } catch (err) {
    res.status(404).json({ message: 'Could not post like', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
