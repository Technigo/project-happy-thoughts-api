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
    maxlength: 140
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
const port = process.env.PORT || 8080
const app = express()
const endPointList = require ('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable. Please try again later' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  if (!res) {
    res
    .status(404)
    .send({ error: 'Oops! Something goes wrong. Try again later!' })
  }
  res.send(endPointList(app))
})

app.get('/thoughts', async (req, res) => {
 try {
   const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
   res.json(thoughts)
  } 
  catch (err) {
   res.status(404).json({ error: 'Page not found'})
  }
})

app.post('/thoughts', async (req, res) => {
  const {message} = req.body
  try {
    const newThought = await new Thought({message}).save()
    res.status(201).json(newThought)
  } catch (err) {
    res.status(400).json({message: 'Could not save new thought', error: err.errors})
  }
})
//I put this code in comment to get more input about the reason it does not work
// app.post('/thoughts/:thoughtId/like', async (req, res) => {
//   try {
//     const { thoughtId } = req.params
//     const newLike = await Thought.updateOne({ _id: thoughtId}, { $inc: { hearts: 1 } })
//     if (newLike) {
//       res.status(201).json(newLike)
//     } else {
//       res.status(404).json({ error: `thought message with id ${thoughtId} can not be found` })
//     }
//   } catch (err) {
//     res.status(400).json({ error: `Id ${thoughtId} is invalid` })
//   }
// })
// POST /thoughts/:thoughtId/like - Like a thought
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    // Success
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } });
    res.status(201).send();
  } catch (err) {
    res.status(400).json({
      message: `Could not save like`,
      error: err.errors
    });
  }
}); 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
