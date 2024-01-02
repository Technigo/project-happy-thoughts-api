import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the Thought model with validation
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: [true, "Message is required"],
    minlength: [5, "Message must be at least 5 characters long"],
    maxlength: [140, "Message must be less than 140 characters"],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set up Express app
const app = express();

// For development: Allow requests from any source
app.use(cors({ origin: '*' }));

// Enable JSON body parsing
app.use(express.json());

// Default route for API documentation
app.get("/", (req, res) => {
  res.json({
    "API documentation": {
      "GET /thoughts": "Fetch the latest 20 thoughts, sorted by createdAt in descending order (arranging data from newer to older).",
      "POST /thoughts": "Create a new thought. Requires JSON body with 'message' field.",
      "POST /thoughts/:thoughtId/like": "Like a thought. Increments the hearts count of the thought by 1. Requires thoughtId in the URL."
    }
  });
});

// GET endpoint to fetch recent thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// POST endpoint to create a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const thought = new Thought({ message });
    await thought.save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ error: "Validation failed", details: err.errors });
  }
});

// POST endpoint to like a thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ error: "Thought not found" });
      return;
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Start the server
const port = process.env.PORT || 1313;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
