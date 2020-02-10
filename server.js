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
    ///Should not be assignable when creating a new thought
  },
  createdAt: {
    type: Date,
    default: Date.now
    //Should not be assignable when creating a new thought
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
app.use(bodyParser.json())

// Start defining your routes here
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })


app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})


app.post('/', async (req, res) => {
  try {
    const thought = await new Thought(req.body).save()
    res.status(201).json(thought)
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought', errors: err.error })
  }
})


// app.post('/:thoughtId/like', async (req, res) => {
//   try {
//     const heartLikes = await thoughts.findByIdAndUpdate({ hearts + 1})

//   }
// })



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
