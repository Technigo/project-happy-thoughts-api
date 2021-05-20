/* eslint-disable linebreak-style */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message is required'],
    unique: true,
    trim: true,
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: 'Numbers are now allowed',
    },
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Thought = mongoose.model('Thought', thoughtSchema)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', (req, res) => {
  Thought.find().then((thoughts) => {
    res.json(thoughts)
  })
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ error: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { 
        _id: id 
      },
      {
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    )
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id })
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
