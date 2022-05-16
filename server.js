import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import allEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "A message is required."],
    minLength: [5, "The message must have min 5 characters and '{VALUE}' was typed."],
    maxLength: [140, "The message must have max 140 characters and '{VALUE}' was typed."],
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  username: {
    type: String,
    maxLength: [15, "The username must have max 15 characters and '{VALUE}' was typed."],
    default: "anonymous",
    trim: true
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

app.get("/", (req, res) => {
  res.send(
    {
      "Welcome!": "Happy Thoughts by Nadia - API",
      "All endpoints are listed here": "/endpoints",
      "Happy Thoughts project has been updated, see API live": "https://happy-thoughts2022.netlify.app/"
    }
  )
})

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
    res.status(200).json(thoughts)
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not fetch thoughts.",
      error: err.errors
    })
  }
})

app.post("/thoughts", async (req, res) => {
  const { message, username } = req.body

  try {
    const newThought = await new Thought({ message, username: username || "anonymous" }).save()
    res.status(201).json(newThought)
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not save this new thought.",
      error: err.errors
    })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const thoughtToLike = await Thought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } })
    res.status(201).json(thoughtToLike)
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not find and update this thought.",
      error: err.errors
    })
  }
})

app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
