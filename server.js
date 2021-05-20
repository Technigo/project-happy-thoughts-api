import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy thoughts!')
})

//Endpoint thats shows list with maximum of 20 thougths
app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find()
    .sort({ createdAt: '1' })
    .limit(20)
    res.json(thoughts)
})

//POST to add a thought
app.post('/thoughts', async (req, res) => {
  try {
    const addThought = await new Thought(req.body).save()
    res.json(addThought)
  } catch (error) {
    res.status(400).json({ message: 'Could not save', fields: error.keyValue })
  }
})

//POST to like a thought
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findOneAndUpdate({ _id: id }, { $inc: { hearts: 1 } }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Message not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

/*
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findOneAndDelete({_id: id })
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
     }
  })

  app.patch('/thoughts/:id', async (req, res) => {
    const { id } = req.params

    try {
      const updatedThought = await Thought.findByIdAndUpdate(id, req.body, { new: true })
      if (updatedThought) {
        res.json(updatedThought)
      } else {
        res.status(404).json({ message: 'Not found'})
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid request', error })
    }
  })

  app.put('/thoughts/:id', async (req, res) => {
    const { id } = req.params

    try {
      const updatedThought = await Thought.findByOneAndReplace({ _id: id }, req.body, { new: true })
      if (updatedThought) {
        res.json(updatedThought)
      } else {
        res.status(404).json({ message: 'Not found'})
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid request', error })
    }
  })
*/

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
