import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//Mongoose model
const Thought = mongoose.model("Thought", {
  message: { type: String, required: true, minlength: 5, maxlength: 140 },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 3000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// List endpoints
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

// GET thought endpoint
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20)
    res.json(thoughts)
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
})

// POST thought endpoint

app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  try {
    const thought = await Thought.create({ message })
    res.status(201).json(thought)
  } catch (error) {
    res.status(400).json({ error: "Invalid input" })
  }
})

// POST like endpoint
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const thought = await Thought.findById(thoughtId)
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" })
    }
    thought.hearts += 1
    await thought.save()

    res.json(thought)
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
