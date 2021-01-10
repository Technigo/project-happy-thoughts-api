import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Thought } from './thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
  const tag = req.query.tag
  const query = tag ? { tags: tag } : {}
  const thoughts = await Thought.find(query).sort({ createdAt: 'desc' }).limit(20)
  res.send(thoughts)
})

app.post('/thoughts', async (req, res) => {
  const message = req.body.message
  const tags = req.body.tags
  const createdBy = req.body.createdBy
  try {
    const newThought = await Thought.create({ message, tags, createdBy })
    res.send(newThought)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const thoughtId = req.params.thoughtId
  try {
    const thought = await Thought.findById(thoughtId)
    await thought.update({ hearts: thought.hearts + 1 })
    res.send(thoughtId)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
