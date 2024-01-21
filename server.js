import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB (Atlas) using the URL from environment variables, or default to local MongoDB
const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost/project-ht-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose model for storing 'Thoughts' with message, hearts, and createdAt fields
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

// Initialize Express app and set the default port
const port = process.env.PORT || 8080;
const app = express();


// Define allowed origins for CORS (Cross-Origin Resource Sharing)
const allowedOrigins = ['https://mc-happy-thoughts.netlify.app'];

// Middleware to configure CORS to accept requests only from the allowed origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware to enable parsing of JSON bodies in requests
app.use(express.json());

// Route for the API's documentation page, displaying available API routes and descriptions
app.get("/", (req, res) => {
  res.json({
    "API Documentation": {
      "GET /thoughts": "Fetch the latest 20 thoughts, sorted by createdAt in descending order.",
      "POST /thoughts": "Create a new thought with a message.",
      "POST /thoughts/:thoughtId/like": "Like a thought by incrementing its heart count."
    }
  });
});

// GET route to retrieve the latest 20 thoughts
// Sorted by createdAt to show the most recent thoughts first
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

// POST route to create a new thought 
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

// POST route to increment the heart count of a thought
// Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart
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
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
