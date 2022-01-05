import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
mongoose.set('useFindAndModify', false)

const port = process.env.PORT || 8080
const app = express()

const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
  },
  tags: {
    type: String,
    enum: ['Food thought', 'Random thought', 'Work thought', 'Other thought'],
    required: true,
  },
  name: {
    type: String,
    minlength: 1,
    maxlength: 300,
    default: 'anonymous',
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
})

const Happy = mongoose.model('Thought', HappyThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello peeps here are some happy thoughts')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Happy.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const { message, tags, name } = req.body
  try {
    const newThought = await new Thought({ message, tags, name }).save()
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { new: true }
    )

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
