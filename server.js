/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const thoughtSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
    validate: {
      validator: (value) => {
        return !(/\b(fuck)\b/i.test(value))
      },
      message: "Cursing words are not allowed"
    }
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

const Thought = mongoose.model('Thought', thoughtSchema)

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  try {
    const thought = new Thought({ message })
    await thought.save()
    res.json(thought)
  } catch (error) {
    res.status(400).json({ error })
  }
})
app.patch('/thoughts/:id/hearts', async (req, res) => {
  const { id } = req.params
  try {
    const thoughtUpdate = await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } }, { new: true })
    if (thoughtUpdate) {
      res.json(thoughtUpdate)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})
app.get('/thoughts', async (req, res) => {
  const { page, perPage } = req.query
  try {
    const thoughts = await Thought.aggregate([
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: ((+page - 1) * perPage) || 0
      },
      {
        $limit: +perPage || 20
      }
    ])
    res.json(thoughts)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
