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
    required: true,
    minlength: 5,
    maxlength: 140
  }, 
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('A little home for my personal Happy Thoughts API')
})

// Get the most recent 20 thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

// Post a new thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  } catch (err) {
    res.status(400).json({message:'Could not save thought', errors: err.errors})
  }
})

// Add a heart to a thought
app.put('/thoughts/:id/like', async (req,res) => {
  try {
    const thought = await Thought.findById(req.params.id)
    await Thought.updateOne({_id: thought._id}, {hearts: thought.hearts + 1})
    res.status(200).json(thought)
  } catch (err) {
    res.status(400).json({message: 'Could not find thought to like', errors: err.errors})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
