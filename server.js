import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

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

//Model
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120
  },
  hearts: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tag: {
    type: String
  },
  name: {
    type: String,
    default: "Anonymous"
  }
})

// Start defining your routes here
app.get('/', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
  const { tag } = req.query
  if (tag) {
    const filteredThoughts = await Thought.find({ tag: tag })
    res.json(filteredThoughts)
  } else {
    res.json(thoughts)
    //res.send('Hello world')
  }
})

app.post('/', async (req, res) => {
  const thought = new Thought({
    message: req.body.message,
    hearts: 0,
    tag: req.body.tag,
    name: req.body.name
  })
  try {
    const saved = await thought.save()
    res.status(201).json(saved)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'could not save thought', errors: err.errors })
  }
})

app.post('/:id/like',
  async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { hearts: 1 } },
        { new: true }
      )
      res.json(thought)
    } catch (err) {
      res
        .status(400)
        .json({ message: 'could not update heart', error: err.errors })
    }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
