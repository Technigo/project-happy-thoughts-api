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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

// Thought Schema
const ThoughtSchema = new Schema({
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
  username: {
    type: String,
    maxlength: 25,
    default: 'HappyAnonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Model for a single Thought
const Thought = mongoose.model('Thought', ThoughtSchema);

// ENDPOINTS 
app.get("/", (req, res) => {
  res.send("Hello, Welcome to Majas HappyThoughts API!");
});

// GET, /thoughts, showing the most recent thoughts (20 of them)
app.get('/thoughts', async (req, res) => {
  try {
    // In JavaScript, desc is not a valid keyword for sorting in MongoDB. Instead, use -1 to sort in descending order based on the createdAt field.
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(201).json({
      success: true,
      response: thoughts,
      message: 'Success'
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: 'No Happy Thoughts here!'
    });
  }
});

app.post('/')
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
