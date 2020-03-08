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
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())


app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
})

app.get('/:thoughtId', async (req, res) => {
  const thoughtId = req.params.thoughtId
  Thought.findOne({ '_id': thoughtId })
    .then((results) => {
      res.json(results)
    })
})

app.post('/', async (req, res) => {
  try {
    const { message } = req.body
    const thought = await new Thought({ message }).save();
    res.status(200).json(thought);
  } catch (err) {
    res.status(400).json({ message: 'Could not post thought', errors: err.errors })
  }
});

app.post('/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.params
    await Thought.updateOne({ '_id': thoughtId }, { $inc: { 'heart': 1 } }, { new: true })
    res.status(201).json({})
  } catch (err) {
    res.status(400).json({ message: 'Could not add like', errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
