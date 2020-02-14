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
    required: true,
    minlength: 5,
    maxlenght: 150
  },
  hearts: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  if (thoughts.length > 0) {
    res.json(thoughts)
  } else {
    res.status(404).json({ message: "No Happy Thoughts yet" })
  }
})

app.post('/thoughts', async (req, res) => {
  //retrieve the information sent by the client to our API endpoint
  const { message, hearts } = req.body
  //use our mongoose model to create the database entry
  const thought = new Thought({ message, hearts })

  try {
    //success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: "Sorry, could not save Happy Thought", error: err.errors })
  }
})

app.put('/thoughts/:createdAt/hearts', async (req, res) => {
  const { createdAt } = req.params
  console.log(`PUT /thoughts/${createdAt}/hearts`)
  await Thought.updateOne({ 'createdAt': createdAt }, { 'hearts': true })
  res.status(201)
})

app.post('/thoughts/:createdAt/likes', async (req, res) => {
  const { createdAt } = req.params
  console.log(`POST /thoughts/${createdAt}/likes`)
  await Thought.updateOne({ 'createdAt': createdAt }, { '$inc': { 'likes': 1 } })
  res.status(201)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
