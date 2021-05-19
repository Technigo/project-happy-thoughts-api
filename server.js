import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const thoughtSchema = new mongoose.Schema({
 message: {
   type: String,
   required: true,
   minlenght: 5,
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

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: 'Service unavailable'
    })
  }
})

app.get('/', (req, res) => {
  res.send('Hello world')
})

//endpoint to get a list of thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

//endpoint to post a thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  } catch (error) {
    res.status(400).json({ message: 'Could not save to database', error: error.errors })
  }
})

//endpoint to increase nr of likes/hearts
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    await Thought.updateOne(
      { _id: req.params.thoughtId },
      { $inc: { hearts: 1 } }
    )
    res.status(200).json()
  } catch (error) {
    res.status(400).json({
      error: 'Invalid request', errors: error.errors
    })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
