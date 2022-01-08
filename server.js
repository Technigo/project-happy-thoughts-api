import express from "express"
import cors from "cors"
import mongoose from "mongoose"
// import res from "express/lib/response"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Mongoose Schema for Thought model
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true, //to dublecheck white spaces in beginning and end
  },
  like: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Number,
    default: Date.now, // type: Date  default: () => Date.now()  // same
  },
})

//Mongoose model with Schema
const Thought = mongoose.model("Thought", ThoughtSchema)

// Start defining your routes here
app.get("/thoughts", async (req, res) => {
  try {
    // Get 20 latest thoughts in descending order
    const thoughtsList = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec()
    res.json(thoughtsList)
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

//  async/await
app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    await newThought({ message }).save() //  const newThought = await new Thought ({ name, description }).save()
    res.status(201).json({ response: newThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Post for adding hearts/like
app.post("/thoughts/:id/like", async (res, req) => {
  const { id } = req.params
  try {
    const updatedLike = await Thought.findByIdAndUpdate(
      id,
      { $inc: { like: 1 } },
      {
        new: true,
      }
    )

    if (updatedLike) {
      res.status(200).json({ response: updatedLike, success: true })
    } else {
      res.status(404).json({ response: "Not found", success: false })
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Delete Thought by Id
app.delete("/thoughts/:id"),
  async (req, res) => {
    const { id } = req.params

    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: id })
      if (deletedThought) {
        res.status(200).json({ response: deletedThought, success: true })
      } else {
        res.status(404).json({ response: "Thought not found", success: false })
      }
    } catch (error) {
      res.status(400).json({ response: error, success: false })
    }
  }

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
