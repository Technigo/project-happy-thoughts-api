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
  createdAt: {
    type: Date,
    default: Date.now
  },
  heart: {
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
app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

app.post('/', async (req, res) => {
  const thought = new Thought({ message: message })
  const { message } = req.body

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: 'Error, could not store thought in database', error: err.errors })
  }
})

app.post('/:id/like', async (req, res) => {
  try {
    const savedLike = await Thought.findOneAndUpdate(
      { _id: req.params.id }, { $inc: { heart: 1 } }
    )
    res.json(savedLike)
  } catch (err) {
    res.status(400).json({  message: 'Error, could not like this thought', error: err.errors })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
