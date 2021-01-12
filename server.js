import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const ERR_CANNOT_FIND_ID = ('Sorry, cant find that thought 😕')

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
mongoose.set('useFindAndModify', false)


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

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello happy happy world 🥳')
})

app.get('/thoughts', async (req, res) => {
  const thought = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thought)
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(200).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought' })
  }
})

app.put('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  const thought = await Thought.findOneAndUpdate({ _id: thoughtId }, {$inc: {'hearts' : 1 }}, { new: true })
  if (thought) {
    res.status(200).json(thought)
  } else {
    res.status(400).json({ message: ERR_CANNOT_FIND_ID })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
