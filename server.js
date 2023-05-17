import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Will create a list of all endpoints in our API
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// Schemas and models constructed here:

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
    default: () => new Date()
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema)




// Start defining your routes here
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "OK",
    body: {
      content: "Matildas Happy Thoughts API",
      endpoints: listEndpoints(app)
    }
  });
});


app.get("/thoughts", async (req, res) => {
    // Find all thoughts, sort in descending order by creation date, limit thoughts to 20, and execute the query.
    const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
    res.status(200).json(thoughts);
});

// Accessing a single thought by _id
// E.g. http://localhost:8080/thoughts/id/6463dda65e61139a83f59492
app.get("/thoughts/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleThought = await Thought.findById(id)
    if (singleThought) {
      res.status(200).json(singleThought);
    } else {
      res.status(400).json('Not found');
    }
    } catch (err) {
      res.status(400).json('No such id found in here');
    }
});


app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new Thought({ message }).save();
    res.status(201).json({
      success: true,
      response: thought,
      message: 'Thought posted successfully'
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: 'Error occured while trying to post the thought'
    })
  }
});


// Patch = update
// E.g. http://localhost:8080/thoughts/id/6463dda65e61139a83f59492/like
app.patch("/thoughts/id/:id/like", async (req, res) => {
  const { id } = req.params;
  // const updateHeart = req.body.updateHeart
  try {
    // const thought = await Thought.findByIdAndUpdate(id, {heart: updateHeart})
    // Find the thought by ID and increment the 'heart' field by 1
    const thought = await Thought.findByIdAndUpdate(id, { $inc: { heart: 1 } }, { new: true });
    res.status(201).json({
      success: true,
      response: thought,
      message: 'Like updated successfully'
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: 'Error occured while trying to update the like'
    })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
