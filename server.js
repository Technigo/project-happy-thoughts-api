import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String, 
    required: [true, 'Message is required!'],
    minlength: [5, 'Thought must be a minimum 5 characters!'],
    maxlength: [140, 'Thought must be a maximum 140 characters!'],
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

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const newThought = await Thought.find().sort({ createdAt: 'desc' }).limit(20)
  res.json({ length: newThought.length, data: newThought })
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.json(newThought)
  } catch (error) {
      res.status(400).json(error)
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
