import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  username: {
    type: String,
    maxlength: 30
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
const listEndpoints = require("express-list-endpoints")

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
});

app.get("/thoughts", async (req,res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20).exec()
  
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(400).json({message: "Could not collect thoughts from the database", error: err.message})
  }
})
app.post("/thoughts", async (req, res) => {
  const { message, username } = req.body

  const thought = new Thought({ message, username: username || "Anonymous" })

  try{
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: "Could not save thought to the database", error: err.message})
  }
})

app.post("/thoughts/:_id/love", async (req, res) => {
  const { _id } = req.params
  console.log(_id)
  try {
    const lovebombedThought = await Thought.findByIdAndUpdate(_id, { $inc: { hearts: 1 } }, {new: true} )
    lovebombedThought ? res.status(201).json(lovebombedThought) : res.status(400).json({message: "Could not find a thought with the given ID", error: err.message})
  } catch (err) {
    res.status(400).json({message: "Could not like this thought", error: err.message})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
