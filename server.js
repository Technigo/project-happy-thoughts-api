import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
//import endpoints from "express-list-endpoints"

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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

//model
const Thought = new mongoose.model("Thought", {
  message: {
    type: String,
    required: [true, "Enter your thought"],
    minlength: [5, "The text is too short. Must be min 5 characters."],
    maxlength: [140, "The text is too long. Can be max 140 characters."],
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello, welcome to happy thoughts API')
  //res.send(endpoints(app))
})

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec()
    res.status(200).json(thoughts)
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

//endpoint for posting thoughts
app.post("/thoughts", async (req, res) => {
  //retrieve the info sent by the client to our API endpoint
  const message = req.body.message

  //use mongoose model to create the DB entry
  const thought = new Thought({ message })

  //save the entry
  try {
    //success
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({ message: "Bad request. Couldn't save thought to the database.", error: err.errors })
  }
})

//endpoint for posting likes/hearts
app.post("/thoughts/:thoughtId/heart", async (req, res) => {
  const thoughtId = req.params.thoughtId

  try {
    //increment the nr of hearts for the thought with specific id
    const savedLike = await Thought.updateOne({ _id: thoughtId }, { $inc: { heart: 1 } })

    res.status(201).json(savedLike)

  } catch (err) {
    res.status(400).json({ message: "Couldn't save the like.", error: err.errors })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
