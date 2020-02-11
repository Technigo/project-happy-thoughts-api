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

app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ 'createdAt': 'desc' }).limit(20).exec()
  res.json(thoughts)
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const newThought = new Thought({ message })

  try {
    await newThought.save()
    res.status(201).json(newThought)
  } catch (err) {
    res.status(400).json({ message: "Could not save thought", error: err.errors })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
