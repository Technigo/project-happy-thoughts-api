import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Thought from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, {
  useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false
})
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

// Endpoint returning 20 thoughts
app.get('/thoughts', async (req, res) => {
  const { page } = req.query
  const pageNo = +page || 1
  const perPage = 20
  // skip: E.g. page 3: 10 * (3-1) = 20, sends 20 as parameter to .skip()
  // skips index 0-19 so that page 3 starts with the book that has index 20
  const skip = perPage * (pageNo - 1)
  const allThoughts = await Thought.find()
  const numThoughts = allThoughts.length
  const pages = Math.ceil(numThoughts / perPage)

  const thoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)

  if (page > pages) {
    res.status(404).json({ message: `There is no page ${page}` })
  } else {
    res.json({
      total_pages: pages,
      page: page,
      thoughts: thoughts
    })
  }
})

// Endpoint expecting a JSON body with the thought message
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const thought = await new Thought({ message }).save()

    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({
      message: 'Could not save thought',
      errors: err.errors
    })
  }

})

// Endpoint taking in _id as params, updating hearts property to add one heart
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params

  try {
    const thoughtLiked = await Thought.findOneAndUpdate(
      { _id: id },
      { $inc: { hearts: 1 } },
      { new: true }
    )

    res.status(201).json(thoughtLiked)
  } catch (err) {
    res.status(400).json({
      message: `No thought with id ${id}`,
      errors: err.errors
    })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
