import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// SCHEMAS
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: 5,
    maxlength: 140,
    trim: true
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

// MODEL
const Thought = mongoose.model('Thought', thoughtSchema)

// ENDPOINTS
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Endpoint with list of thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

// Endpoint to post thoughts
app.post('/thoughts', async (req, res) => {
  // const { message } = req.body
  // const thought = new Thought({ message })
  // try {
  //   const postedThought = await thought.save()
  //   res.json(postedThought)
  // } catch (error) {
  //   res.status(400).json({ message: 'Could not post thought', error: err.errors })
  // }
  try { 
    const newThought = await new Thought(req.body).save().limit(20)
    res.json(newThought);
  } catch (error) {
    res.status(400).json({ message: 'Could not post thought', error: err.errors })
  }
});

// endpoint to delete a thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id })
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found '})
    } 
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// endpoint to change a thought
app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, req.body, {new: true})
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(400).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ messge: 'Invalid request', error })
  }
})

// another endpoint to change a thought
app.put('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedThought = await Thought.findOneAndUpdate({ _id: id }, req.body, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(400).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ messge: 'Invalid request', error })
  }
})

// Endpoint to like a thought
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  try {
    const likedThought = await Thought.findByIdAndUpdate(id, { $inc: {hearts: 1} }, {new: true})
    if (likedThought) {
      res.json(likedThought)
    } else {
      res.status(400).json({ message: 'Not found' })
    }
  } catch (err) {
    res.status(400).json({ messge: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
