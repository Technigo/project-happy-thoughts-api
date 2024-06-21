import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"
import dotenv from "dotenv"

dotenv.config()

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-axel"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const { Schema, model } = mongoose

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  hearts: {
    type: Number,
    default: 0,
  },
})

const Thought = model("Thought", thoughtSchema)

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec()
  try {
    res.status(201).json({
      success: true,
      respone: thoughts,
      message: "Thought retrived",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Thoughts could not be retrived",
    })
  }
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  const thought = new Thought({ message })

  try {
    const newThought = await thought.save()
    res.status(201).json({
      success: true,
      response: newThought,
      message: "Thougt posted",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      meessage: "Thought could not be posted",
    })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const likeThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true, runValidators: true }
    )
    res.status(200).json({
      sucess: true,
      response: likeThought,
      message: "Happy thought was successfully liked",
    })
  } catch (error) {
    res.status(400).json({
      sucess: false,
      response: error,
      message: "Could not like Happy thought",
    })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
