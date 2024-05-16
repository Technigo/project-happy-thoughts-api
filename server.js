import cors from "cors"
import express from "express"
import expressListEndpoints from "express-list-endpoints"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

// Endpoint only get 20 thoughts sorted
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec()
  res.json(thoughts)
})

// Post thought endpoint
app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })

  try {
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({
      message: "Could not save thought to the database",
      error: err.error,
    })
  }
})

// Post heart endpoint
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params
    const thought = await Thought.findById(thoughtId)
    if (!thought) {
      return res.status(400).json({ error: "Could not find thought" })
    }
    thought.hearts++
    await thought.save()
    res.json({ message: "Like added", thought })
  } catch (err) {
    res.status(400).json({
      message: "Could not like the thought",
      error: err.error,
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
