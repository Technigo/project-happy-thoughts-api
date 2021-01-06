import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import endpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
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

const port = process.env.PORT || 8080
const app = express()


app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send(endpoints(app))
})

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec()
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({ error: error })
  }
})

app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thought({ message: req.body.message }).save()
    res.status(200).json(thought)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  try {
    const { id } = req.params
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } })
    res.status(200).send()
  } catch (error) {
    res.status(404).json({ error: 'No thought found' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
