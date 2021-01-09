import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: [true, 'Message required'],
    minLength: [5, 'Message too short, minimum 5 characters'],
    maxLength: [140, 'Message too long, maximum 140 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hearts: {
    type: Number,
    default: 0
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Happy thoughts API')
})

app.get('/thoughts', async (req, res) => {
  try {
    res.status(200).json(await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec())
  } catch (error) {
    res.status(400).json({ message: 'Could not get thoughts', error })
  }
})

app.post('/thoughts', async (req, res) => {
  try {
    res.status(201).json(await new Thought({ message: req.body.message }).save())
  } catch (error) {
    res.status(400).json({ message: 'Could not save thought', error: error.errors.message.message })
  }
})

// delete not yet used in frontend
app.delete('/thoughts/:id', async (req, res) => {
  try {
    res.status(200).json(await Thought.deleteOne({ _id: req.params.id }))
  } catch (error) {
    res.status(400).json({ message: 'Could not delete thought', id: error.value })
  }
})

// put - replace complete object, not yet used in frontend
app.put('/thoughts/:id', async (req, res) => {
  try {
    res.status(200).json(await Thought.replaceOne({ _id: req.params.id }, { message: req.body.message, createdAt: Date.now, hearts: 0 }))
  } catch (error) {
    res.status(400).json({ message: 'Could not replace thought', id: error.value })
  }
})

// patch - update parts of object, not yet used in frontend
app.patch('/thoughts/:id', async (req, res) => {
  try {
    res.status(200).json(await Thought.updateOne({ _id: req.params.id }, { message: req.body.message }))
  } catch (error) {
    res.status(400).json({ message: 'Could not update thought', id: error.value })
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  try {
    res.status(201).json(await Thought.updateOne({ _id: req.params.id }, { $inc: { 'hearts': 1 } }, { new: true }))
  } catch (error) {
    res.status(404).json({ message: 'Could not post like', id: error.value })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
