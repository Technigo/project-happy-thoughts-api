import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import allEndpoints from "express-list-endpoints"

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-backend"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const { Schema } = mongoose

const thoughtSchema = new Schema({
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
    default: () => new Date(),
  },
})

const Thought = mongoose.model("Thought", thoughtSchema)

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Error message if it's not possible to connect to the database
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

// API documentation
app.get("/", (req, res) => {
  const documentation = {
    "About": "Welcome to Jessicas Happy Thoughts API",
    "You can find all available endpoints here": "/endpoints",
    "Frontend project": "https://jessicas-happy-thoughts-project.netlify.app",
  }
  res.send(documentation)
})

// Get thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec()
    res.status(200).json(thoughts)
  } catch (err) {
    res.status(400).json({
      error: err.errors,
    })
  }
})

// Post your own thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const thoughtToAdd = await new Thought({ message }).save()
    res.status(201).json(thoughtToAdd)
  } catch (err) {
    res.status(400).json({
      message: "Could not save the thought",
      errors: err.errors,
    })
  }
})

// Like a thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1 },
    });
    res.status(201).json(likedThought)
  } catch (err) {
    res.status(400).json({
      message: "Bad request. Could not find any thought with this id",
      errors: err.errors,
    })
  }
})

// Get all available endpoints
app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
