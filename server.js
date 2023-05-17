import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndPoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndPoints(app));
});

// The thought model
const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});
const Thought = mongoose.model("Thought", ThoughtSchema);

// This endpoint should return a maximum of 20 thoughts
// and sorted by createdAt to show the most recent thoughts first.
app.get("/thoughts", async(req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

// Post new thought
app.post("/thoughts", async(req, res) => {
  const { message } = req.body;
  try {
    const newThought = await Thought({message}).save();
    res.status(201).json({
      success: true,
      response: newThought,
      message: "new thought created successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      respone: e,
      message: "error occured, could not create new thought"
    });
  }
});

// Update amount of likes (hearts)
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  const { addHeart } = req.body;
  try {
    const updateHearts = await Thought.findByIdAndUpdate(thoughtId, {hearts: addHeart});
    res.status(201).json({
      success: true,
      response: {},
      message: "updated successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occured, could not update hearts"
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
