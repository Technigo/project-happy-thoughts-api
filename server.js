import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

if (process.env.RESET_DATABASE) {
  console.log('Resetting database ...')
  const seedDatabase = async () => {
    await Thought.deleteMany()
    await Thought.forEach((happy) => new Thought(happy).save())
  }
  seedDatabase()
}

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

app.get('/GET', async (req, res) => {
  const happyThoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  if (happyThoughts) {
    res.status(201).json(happyThoughts)
  } else {
    res.status(401).json({ message: 'Could not find Happy Thoughts' })
  }

})

app.post('/POST', async (req, res) => {
  const { message } = req.body
  console.log({ message })
  const happyThought = new Thought({ message })
  try {
    const savedHappyThought = await happyThought.save()
    res.status(201).json(savedHappyThought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save the thought to the Database', error: err.errors })
  }
})
app.post('/POST/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  console.log(`POST /POST/${thoughtId}/like`)
  await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
  res.status(201).json()
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
