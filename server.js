import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import Thought from './models/thought'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'service unavailable' })
  }
})

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)

  //below is code for pagination. Commented out since I couldn't connect it to front-end.
  /* const { page = 1, limit = 20 } = req.query

  try {
    const thoughts = await Thought.find()
      .sort({createdAt: 'desc'})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Thought.countDocuments()

    res.status(200).json({
      thoughts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(400).json({success: false, message: error.message})
  } */
})

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message }).save()
    res.status(200).json(newThought)
  } catch (error) {
    console.log(error)
    res.status(400).json({success: false, error: error})
  }
})

//not used in front-end at the moment.
app.delete('/thoughts/:id', async (req, res) => {
  try {
    await Thought.deleteOne({ _id: req.params.id })
    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error: error })
  }
})

//updateOne- first object matches the object in the database, second what object should be changed
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    const updatedThought = await Thought.updateOne(
      { _id: req.params.thoughtId },
      { $inc: { hearts: 1 } }
    )
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json({ success: false, error: error })
  } 
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
