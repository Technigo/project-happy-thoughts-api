import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Message = mongoose.model('Message', {
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
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Message.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const thought = await new Message({ message }).save()
    res.status(201).json(thought)
  } catch (error) {
    res.status(400).json({ data: 'Could not save message', error: error.errors })
  }
})

app.post('/thoughts/:id/heart', (req, res) => {
  const { heart } = req
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
