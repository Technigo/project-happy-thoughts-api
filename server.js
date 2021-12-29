import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: { type: String, minLength: 4, maxLength: 250 },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() },
})

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20)
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({ message: 'Could not find thoughts', errors: err.errors })
  }
})

app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  try {
    const thought = await new Thought({ message: message }).save()
    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', errors: err.errors })
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  try {
    const thought = await Thought.findByIdAndUpdate(
      { _id: id },
      { $inc: { hearts: 1 } },
      { new: true }
    )
    res.status(200).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not find thought', errors: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
