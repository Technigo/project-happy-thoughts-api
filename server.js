import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import allEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
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
    required: true,
    minLength: [5, "Minimum is 5, you entered '{VALUE}'"],
    maxLength: [140, "Maximum is 140, you entered '{VALUE}'"]
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!")
})

app.get("/thoughts", async (req, res) => {
  const testing = await Thought.find().sort({createdAt: "desc"}).limit(20).exec()
  res.status(200).json(testing)
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  try {
    // const thought = new Thought({ message, hearts })
    // await thought.save()
    const thought = await new Thought({ message }).save()
    res.status(201).json(thought)

  } catch (err) {
    res.status(400).json({ errorMessage: "Could not save thought", error: err.errors })
  }
})

// app.post("/thoughts/:thoughtId/like", async (req, res) => {
// //  code here
// })

app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
