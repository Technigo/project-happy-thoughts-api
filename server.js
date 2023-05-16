import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happyThoughtsAPI";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const { Schema } = mongoose
const HappyThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
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

const Thought = mongoose.model("Thought", HappyThoughtSchema)
// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughtItem = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
    res.status(200).json({
      success: true,
      message: "Items fetched succesfully",
      response: thoughtItem
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "No data available",
      response: e
    })
  }
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  try {
    const thoughtItem = await new Thought({ message }).save()
    res.status(201).json({
      success: true,
      message: "New thought created successfully",
      response: thoughtItem
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Could not create new thought, please see error details",
      response: e
    })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const LikedItem = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    res.status(201).json({
      success: true,
      message: "Specific thought liked successfully",
      response: LikedItem
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "An error occured while trying to add a like the thought",
      response: e
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
