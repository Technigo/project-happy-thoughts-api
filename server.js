import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27107/project-mongo";
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

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 3,
    maxlength: 300,
    required: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Root endpoint to list all endpoints
app.get("/", (request, response) => {
  response.json(listEndpoints(app));
});

// GET endpoint to retrieve 20 most recent thoughts
app.get("/thoughts", async (request, response) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  if (thoughts.length > 0) {
    response.json(thoughts);
  } else {
    response.status(404).json({ error: "Thoughts not found" });
  }
});

// POST endpoint to create a new thought
app.post("/thoughts", async (request, response) => {
  const { message } = request.body;
  try {
    const newThought = await new Thought({
      message: message
    }).save();
    response.status(200).json({
      success: true,
      response: `This thought was posted: ${newThought}`
    });
  } catch (err) {
    response.status(400).json({
      success: false,
      response: 'Thought could not be posted',
      errors: err.errors
    });
  }
});

// POST endpoint to increase the number of hearts for a thought
app.post('/thoughts/:id/like', async (request, response) => {
  const { id } = request.params;
  try {
    const heartUpdate = await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } });
    if (heartUpdate) {
      response.status(200).json({
        success: true,
        response: `Heart-count was updated for post ${heartUpdate.id}`
      });
    } else {
      response.status(404).json({
        success: false,
        response: 'Thought not found'
      });
    }
  } catch (err) {
    response.status(400).json({
      success: false,
      response: 'Heart-count could not update',
      error: err.errors
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});