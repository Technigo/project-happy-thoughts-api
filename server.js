import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import Thought from "./models/Thoughts"
import expressListEndpoints from "express-list-endpoints"

//.env
dotenv.config()

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//The port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Route handler
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

//Get thoughts, descending by created and limit to 20 thoughts
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec()

  try {
    res.status(201).json({
      sucess: true,
      response: thoughts,
      message: "Happy thoughts retrieved",
    })
  } catch (error) {
    res.status(400).json({
      sucess: false,
      response: error,
      message: "Could not retrieve any Happy thoughts",
    })
  }
})

//Post a thought endpoint
app.post("/thoughts", async (req, res) => {
  const { message } = req.body //Retrieve the information sent by user to our API endpoint

  //Use the mongoose model to create the database entry
  const thought = new Thought({ message })

  try {
    const newThought = await thought.save()
    res.status(201).json({
      sucess: true,
      response: newThought,
      message: "Thought posted",
    })
  } catch (error) {
    res.status(400).json({
      sucess: false,
      response: error,
      message: "Could not post thought",
    })
  }
})

//Post request to like a Happy thought
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
