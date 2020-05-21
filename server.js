import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// Error messages 
const ERR_CANNOT_FIND = "Couldn't find any thoughts"
const ERR_CANNOT_POST = "Couldn't post thought"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 150
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({error: 'Unavaliable service'})
  }
})

app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  if (thoughts) {
    res.status(200).json(thoughts)
  } else {
    res.status(404).json({ message: ERR_CANNOT_FIND, error: err.errors})
  }
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  try {
    const savedThough = await thought.save()
    res.status(200).json(savedThough)
  } catch (err) {
    res.status(400).json({message: ERR_CANNOT_POST, error: err.errors})
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    await Thought.updateOne({'_id': thoughtId}, {'$inc': {'hearts': 1 }})
    res.status(201).json()
  } catch (err) {
    res.status(404).json({message: `Couldn't like ${thoughtId}`, error: err.errors})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
