import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defining the port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "A message is required, please type a happy thought :)"],
    minlenght: [5, "Sorry, your message needs to have at least 5 characters"],
    maxlenght: [140, "Sorry, you message is unfortunately exceeding the limit of 140 characters"]
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

// ROUTES
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Endpoint to get the most recent 20 thoughts in descending order
app.post('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    if (allThoughts) {
      res.status(200).json(allThoughts)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Endpoint to post a new thought 
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message }).save()
    if (newThought) {
      res.status(200).json(newThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Endpoint to update likes/hearts 
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const updatedThought = await Thought.findOneAndUpdate(thoughtId, { $inc: { hearts: 1 } }, { new: true })
    if (updatedThought) {
      res.json(updatedThought)
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// // Endpoint to delete a thought
// app.delete('/thoughts/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const deletedThought = await Thought.deleteOne({ _id: id })
//     res.json(deletedThought)
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid request', error })
//   }
// })

// // Endpoint to replace a thought
// app.put('/thoughts/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const replacedThought = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true })
//     if (replacedThought) {
//       res.json(replacedThought)
//     } else {
//       res.status(404).json({ message: 'Not found' })
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid request', error })
//   }
// })

// // Endpoint to update a thought
// app.patch('/thoughts/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const updatedThought = await Thought.findByIdAndUpdate(id, req.body, { new: true })
//     if (updatedThought) {
//       res.json(updatedThought)
//     } else {
//       res.status(404).json({ message: 'Not found' })
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid request', error })
//   }
// })

// Starting the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
