import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String, 
    required: [true, 'Oh you silly, message is required!'], 
    trim: true,
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

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json({ length: thoughts.length, data: thoughts })
})

app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thought(req.body).save()
    res.status(200).json(thought)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params 
  
  try {
    const thoughtLike = await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    if (thoughtLike) {
      res.json({ data: thoughtLike })
    } else {
      res.status(404).json({ error: 'Not found!' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
