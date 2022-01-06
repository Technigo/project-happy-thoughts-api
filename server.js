import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // () => Date.now()
  },
})

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// GET list of posts, maximum 20 posts and sorted by date (recent first)
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec()
  if (thoughts > 0) {
    res.status(200).json(thoughts) // 200 - ok
  } else {
    res.status(404).json({ message: 'No posts yet' })
  }
})

// Create a post - with async await
app.post('/thoughts', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const { message, hearts } = req.body
  // Use our mongoose model to create the database entry
  const thought = new Thought({ message, hearts })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought) // 201 - created
  } catch (err) {
    res
      .status(400) // 400 - bad request
      .json({ message: 'Could not save to the Database', error: err })
  }
})

// Like a post by increasing the hearts by 1 - with async await
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const addHeart = await Thought.findByIdAndUpdate(
      { _id: thoughtId },
      { $inc: { hearts: 1 } },
      { new: true, useFindAndModify: false } // useFindAndModify to remove DeprecationWarning
    )
    if (addHeart) {
      res.status(200).json(addHeart)
    } else {
      res.status(404).json({ message: `Post by id '${thoughtId}' not found` })
    }
  } catch (err) {
    res
      .status(400) // 400 - bad request
      .json({
        message: `Could not update the hearts`,
        error: err,
      })
  }
})

// Delete a post - with async await
app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId })
    if (deletedThought) {
      res.status(200).json(deletedThought)
    } else {
      res.status(404).json({ message: `Post by id '${thoughtId}' not found` })
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not delete the post', error: err })
  }
})

// Edit a post - with promises
// app.patch('/thoughts/:thoughtId', (res, req) => {
//   const { id } = req.params
//   const { updatedMessage } = req.body

//   Thought.findOneAndUpdate(
//     { _id: id },
//     { message: updatedMessage },
//     { new: true }
//   )
//     //shorthand const { message } = req.body, findOneAndUpdate({_id: id}, {message}, {new: true})
//     .then((updatedThought) => {
//       if (updatedThought) {
//         res.status(200).json({ updatedThought })
//       } else {
//         res.status(404).json({ messageresponse: 'Thought not found' })
//       }
//     })
//     .catch((err) => {
//       res.status(400).json({ message: 'error', error: err })
//     })
// })

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
