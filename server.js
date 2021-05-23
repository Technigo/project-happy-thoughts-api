/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
// eslint-disable-next-line max-len
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const thougthSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Empty message not allowed'],
    trim: true,
    minlength: [5, 'Message must be longer than 5 characters'],
    maxlength: [140, 'Message must be shorter than 140 characters']
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

const Thought = mongoose.model('Thought', thougthSchema)

const port = process.env.PORT || 8081
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20).exec()
  
  res.json(allThoughts)
})

app.get('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  const thought = await Thought.findById(id)
  const thoughtNotHandled = Thought.findById(id)
  res.json(thought)
  console.log('111', thought)
  console.log('222', thoughtNotHandled)
})

// POST endpoint for new thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message }).save()
    res.json(newThought)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

// POST endpoint to update number of hearts on thought
app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { 
        _id: id 
      }, 
      { 
        $inc: 
          { 
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

// DELETE endpoint to find and delete a thought
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
