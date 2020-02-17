import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {

  name: {
    type: String,
    maxlength: 50,
    default: 'Anonymous'
  },

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
  },
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


app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  if (thoughts.length > 0) {
    res.json(thoughts)
  } else {
    res.status(400).json({ message: "Fill up this empty space with your happiness" })
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.params
    await Thought.updateOne({ '_id': thoughtId }, { '$inc': { 'hearts': 1 } })
    res.status(201).json({ message: `Thought Id nr: ${thoughtId} got one heart update` })
  } catch (err) {
    res.status(400).json({ message: 'Could not update heart', errors: err.error })
  }
})

app.post('/', async (req, res) => {
  try {
    const { message, name } = req.body
    const thought = await new Thought({ message, name }).save()
    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', errors: err.error })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
