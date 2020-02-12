import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// MONGOOSE SETUP
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// MODEL FOR THOUGHT
const Thought = mongoose.model('Thought', {
  message: { type: String, requierd: true, minlength: 5, maxlength: 140 },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

// SEEDING FOR ADDING NEW DATA
if (process.env.RESET_DB) {
  console.log('Resetting database')
  const seedDatabase = async () => {
    await Thought.deleteMany({})

    // thought.forEach(() => {
    //   new Thought().save()
    // })
  }
  seedDatabase()
}

// PORT & APP SETUP
const port = process.env.PORT || 8080
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailabale' })
  }
})

// THOUGHTS
app.get('/', async (req, res) => {
  // Returning 20 thoughts order by last created first
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  if (thoughts) {
    res.status(200).json(thoughts)
  } else {
    res.status(404).json({ message: 'Could not find thoughts', error: err.errors })
  }
})

app.post('/', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  try {
    //Sucess
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    // Failed
    res.status(400).json({ message: 'Could not send thought', error: err.errors })
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    //Sucess to updatde the specific thought with increament hearst by 1
    await Thought.updateOne({ '_id': thoughtId }, { '$inc': { 'hearts': 1 } })
    res.status(201)
  } catch (err) {
    // Failed
    res.status(404).json({ message: 'Could not find thought', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
