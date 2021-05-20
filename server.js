import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'





const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server

const port = process.env.PORT || 9000
const app = express()

const thoughtSchema  = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Ding, dong! Message is required!"],
    minLength: [5, 'Hey, the minimum length is 5 characters'],
    maxLength: [140, 'Hey, the maximum length is 140 characters'],
    //unique: true,
    //trim: true,
     // enum: ['Technigo is cool', 'Technigo is great', 'That was the time of my life'],
    // match: /^[^0-9]+$/,
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value)
      },
      message: "Numbers are not allowed"
    },
    username: {
      type: String,
      maxLength: 15,
      default: 'Anonymous'
    },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
})

const Thougt = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: 'Service unavailable'
    })
  }
})

// DEFINING ROUTES AND ENDPOINTS
app.get('/', (req, res) => {
  res.send("Hola Mundo! This is Estefania's Happy Coding Thoughts API <3")
})

//GET /thoughts: this endpoint will show the 20 most recent thoughts 
app.get('/thougts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

//ENDPOINT TO POST A THOUGHT
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save()
    res.status(200).json(newThought)
  }  catch (error)  {
       res.status(400).json({ 
         message: 'Could not save to database', error
         })
     }
})

//ENDPOINT TO ADD LIKES/HEARTS
app.post('/thoughts/:thoughtsId/like', async (req, res) => {
  const { thoughtId } = req.params

  try {
    const like = await Thought.findOneAndUpdate(
      {_id: thoughtId },
      { $inc: { hearts: 1 } },
      { new: true }
    )
    if (like) {
    res.status(200).json(like)
    } else {
      res.status(404).json({
      message: 'Message was not found'
    })
    }
  } catch (error) {
    res.status(400).json({
      message: 'Invalid request', error
    })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
