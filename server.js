import express from "express"
import cors from "cors"
import mongoose from "mongoose"
//import allEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next()
//   } else {
//     res.status(400).json({ response: error, success: false })
//   }
// })

const ThoughtSchema = new mongoose.Schema({
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

const Thought = mongoose.model("Thought", ThoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hi! This is the API for Lovisas Happy Thoughts.")
})

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec()
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    })
  }
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  try {
    const newThougt = await new Thought({ message }).save()
    res.status(201).json({ response: newThougt, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
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
    res.status(200).json({ response: updatedThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// app.get("/endpoints", (req, res) => {
//   res.send(allEndpoints(app))
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
