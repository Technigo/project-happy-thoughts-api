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

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: [true, "A message is required."],
    minLength: [5, "The message must have min 5 characters, you typed '{VALUE}'."],
    maxLength: [140, "The message must have max 140 characters, you typed '{VALUE}'."]
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
    maxLength: [15, "The username must have max 15 characters, you typed '{VALUE}'"],
    default: "anonymous"
  }
})

app.get("/", (req, res) => {
  res.send(
    {
      "Welcome": "Happy Thoughts 2022 - API!",
      "All endpoints are listed here": "/endpoints",
      "See API live in week 11's project": "https://happy-thoughts2022.netlify.app/"
    }
  )
})

app.get("/thoughts", async (req, res) => {
  const testing = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
  res.status(200).json(testing)
})

app.post("/thoughts", async (req, res) => {
  const { message, username } = req.body
  try {
    // const thought = new Thought({ message, hearts })
    // await thought.save()
    const thought = await new Thought({ message, username: username || "anonymous" }).save()
    res.status(201).json(thought)

  } catch (err) {
    res.status(400).json({ message: "Could not save thought", error: err.errors })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId

  try {
    const likedThought = await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    res.status(201).json(likedThought)
  } catch (err) {
    res.status(400).json({ message: "Could not find this thought", error: err.errors })
  }
})

app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
