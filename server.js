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
const port = process.env.PORT || 8000
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
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: "anonymous",
    minlength: 2,
    maxlength: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Start defining your routes here
app.get("/", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20).exec()
  if (thoughts.length > 0) {
    res.json(thoughts)
  } else {
    res.status(404).json({ message: "No happy thoughts" })
  }
})

app.post("/", async (req, res) => {
  //Get info sent by client to our API endpoint
  const { message, name } = req.body
  //Use our mongoose model to create a new database entry
  const thought = new Thought({ message, name })
  try {
    //Sucess case
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  }
  catch (err) {
    res.status(400).json({ message: "Couldn't save thought", error: err.errors })
  }
})

app.post("/:thoughtID/like", async (req, res) => {
  //Find specific thought
  const thoughtID = req.params.thoughtID
  const thought = await Thought.findById(thoughtID)

  if (thought) {
    //Sucess case
    thought.hearts += 1
    thought.save()
    res.status(201).json(thought)
  }
  else {
    res.status(404).json({ message: `No thought with id: ${thoughtID} `, error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
