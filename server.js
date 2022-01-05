import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/myHappyThoughtsApi"
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
})

const Thought = mongoose.model("Thought", ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world this is my own happy thoughts api")
})

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec()
  res.json(thoughts)
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ message }).save()
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const updatedHearts = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    )
    res.status(200).json({ response: updatedHearts, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id })
    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true })
    } else {
      res.status(404).json({ response: error, success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params
  const { message } = req.body
  const { hearts } = req.params

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: id },
      { message },
      { hearts },
      { new: true }
    )
    if (updatedThought) {
      res.status(200).json({ response: updatedThought, success: true })
    } else {
      res.status(404).json({ response: "thought not found", success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
