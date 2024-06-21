import cors from "cors"
import express from "express"
import mongoose from "mongoose"

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
  thought: {
    type: String,
    required: true,
    minlength: 4,
  },
  date: {
    type: Date,
    required: true,
  },
  isVirtual: {
    type: Boolean,
    default: false,
  },
  typeOfEvent: {
    type: String,
    enum: ["other"],
    default: "other",
  },
})

const Thought = model("Thought", thoughtSchema)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!")
})
app.post("/thoughts", async (req, res) => {
  const { name, date, isVirtual, typeOfEvent } = req.body
  try {
    const thought = await new Thought({
      name,
      date,
      isVirtual,
      typeOfEvent,
    }).save()

    res.status(201).json({
      success: true,
      respone: thought,
      message: "Thought created",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Thought could not be created",
    })
  }
})

app.patch("thoughts/:id", async (req, res) => {
  const { id } = req.params

  const { newThought } = req.body
  try {
    const thought = await Thought.findByIdAndUpdate(
      id,
      { name: newThought },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: false,
      response: thought,
      message: "Thougt updated",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      meessage: "Thought could not be updated",
    })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
