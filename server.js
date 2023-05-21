import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// SCHEMA GOES HERE
const { Schema } = mongoose;

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema)

// ROUTES GOES HERE
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "OK",
    body: {
      content: "Welcome to Happy Thoughts API!",
      endpoints: listEndpoints(app)
    }
  });
});

// GET 20 LATEST THOUGHTS
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc', _id: 'desc' }).limit(20).exec();
  res.status(200).json(thoughts);
});

// GET THOUGHT BY ID
app.get("/thoughts/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleThought = await Thought.findById(id)
    if (singleThought) {
      res.status(200).json(singleThought);
    } else {
      res.status(400).json('Not found');
    }
    } catch (e) {
      res.status(400).json('No such id');
    }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new Thought({ message }).save();
    res.status(201).json({
      success: true,
      response: thought,
      message: 'Happy thought successfully sent!'
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: 'Error! Happy thought NOT sent successfully!'
    })
  }
});

// PATCH
app.patch("/thoughts/:_id/like", async (req, res) => {
  const { _id } = req.params;
  try {
    const thought = await Thought.findByIdAndUpdate(_id, { $inc: { heart: 1 } }, { new: true });
    res.status(201).json({
      success: true,
      response: thought,
      message: 'Updated successfully!'
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: 'Error trying update the like!'
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});