import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
// import Person from './PersonModel'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 3,
    maxlenght: 500
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
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
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

// find all tasks
app.get('/', async (req, res) => {
  const thought = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  res.json(thought)
})

//post thought
app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(200).json(savedThought)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'could not save thought', errors: err.errors })
  }
})

//like thought
app.post('/:id/like', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { hearts: 1 } }
    )
    res.status(200).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'could not save like', errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
