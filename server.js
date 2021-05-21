import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()

const thoughtSchema = new mongoose.Schema({
 message: {
   type: String,
   required: [true, 'Message is required'],
   minlength: [5, 'Minimum length is 5 characters'],
   maxlength: [140, 'Maximum length is 140 characters']
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      message: 'Service unavailable'
    })
  }
})

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//endpoint to GET a list of happy thoughts
app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.json(thoughts)
})

//endpoint to POST a happy thought
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  } catch (error) {
    res.status(400).json({
      message: 'Could not save to database',
      error
    })
  }
})

//endpoint to increase nr of likes/hearts
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const like = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $inc: { hearts: 1 } },
      { new: true }
    )
    if (like) {
    res.status(200).json(like)
    } else {
      res.status(404).json({
        message: 'Message not found'
      })
    }
  } catch (error) {
    res.status(400).json({
      message: 'Invalid request',
      error
    })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
