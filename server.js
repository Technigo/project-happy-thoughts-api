import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

dotenv.config()
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true 
})
mongoose.Promise = Promise

const port = process.env.PORT || 8082
const app = express()

const thoughtSchema = new mongoose.Schema({
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

const Thought = mongoose.model('Thought', thoughtSchema)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  try {
    res.send(listEndpoints(app))
  } catch (error) {
    res.status(404).json({ error: 'Page not found' })
  }
})

app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(allThoughts)
  } catch (error) {
    res.status(404).json({ error: 'Page not found' })
  }
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({
      message: req.body.message
    }).save()
    res.json(newThought)  
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Duplicated value", fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({
      message: req.body.message
    }).save()
    res.json(newThought)  
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Duplicated value", fields: error.keyValue })
    }
    res.status(400).json(error)
  }
})

app.delete('/thoughts/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedThoughts = await Thought.findByIdAndDelete({
      _id: id
    })
    res.json(updatedThoughts)
  } catch (error) {
    res.status(400).json({ error: "Could not delete", fields: error.keyValue })
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
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Thought not found' })
    }
  } catch {
    res.status(400).json({ message: "Failed to heart that thought. Sorry!" })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
