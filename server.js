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

app.get('/', async(req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
})

app.get('/:thoughtId', async(req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOne({ '_id': thoughtId })
    .then((result) => {
      res.json(result)
    })
})

app.post('/', async(req, res) => {
  try {
    const { message } = req.body
    const thought = await new Thought({ message }).save()
    res.status(200).json(thought);
    console.log({ message })
  } catch (err) {
    res.status(400).json({ message: 'Could not post your thought' })
  }
});

app.post('/:thoughtId/like', async(req, res) => {
  try {
    const { thoughtId } = req.params
    console.log(`POST /${thoughtId}/like`)
    await Thought.updateOne({ '_id': thoughtId }, { $inc: { 'heart': 1 } }, { new: true })
    res.json(201).json({})
  } catch (err) {
    res.json(400).json({ message: 'Could not add like', errors: err.errors })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})