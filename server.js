import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import Thought from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/hanna-happyThoughts" 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()
const endpoints = require('express-list-endpoints')

const POST_LIKE_ERROR = 'Error: could not add like on message with id:'
const GET_ENDPOINTS_ERROR = 'Error: No endpoints found'

// MIDDLEWARES (to enable cors and json body parsing)
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// RESET DATABASE
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Thought.deleteMany()
  }
  seedDatabase()
}

//////ROUTES (ENDPOINTS)////

//GET: All available endpoints with express-list-endpoints
app.get('/', (req, res) => {
  if (res) {
    res.status(200).send(endpoints(app));
  } else {
    res.status(404).send({ error: GET_ENDPOINTS_ERROR });
  }
});

// GET 20 THOUGHTS IN DESC. ORDER SORTED ON TIMESTAMP (default)
// SORT THOUGHTS:
// - most likes: /thoughts/?sort=likes
// - oldest first / asc: /thoughts/?sort=oldest
// - newest first / desc (default): /thoughts/?sort=newest
app.get('/thoughts', async (req, res) => {
  const sort = req.query.sort

  const sortedThoughts = sort => {
    if (sort === 'liked') {
      return { hearts: 'desc' }
    } else if (sort === 'oldest') {
      return { createdAt: 'asc' }
    } else if (sort === 'default') {
      return { createdAt: 'desc' }
    } else {
      return { createdAt: 'desc' }
    }
  }

  const thoughts = await Thought.find()
    .sort(sortedThoughts(sort))
    .limit(20)
    res.status(200).json(thoughts) // No error message because I want an empty string if no posts.
})

//POST: ADD A THOUGHT
app.post('/thoughts', async (req, res) => {
  const { message, name } = req.body

  try {
    const newThought = await new Thought({ message, name }).save()
    res.status(201).json(newThought)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      error: err.errors.message.message // displays error message specified in the model
    })
  }
})

//POST: LIKE A THOUGHT 
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } })
    res.status(201).json(`Thought with id: ${id} got one more like`)
  } catch (err) {
    res.status(404).json({
      message: `${POST_LIKE_ERROR} ${id}`,
      error: err.errors
    })
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
