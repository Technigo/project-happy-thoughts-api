import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";


// Load environment variables
dotenv.config();

mongoose.set('strictQuery', false);


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, {});
mongoose.Promise = global.Promise;

// Define mongoose schema for Thought
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
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

// Create mongoose model for Thought
const Thought = mongoose.model("Thought", thoughtSchema);

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Happy Thoughts API",
    endpoints: expressListEndpoints(app),
  });
});

// GET /thoughts - Get up to 20 most recent thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching thoughts" });
  }
});

// POST /thoughts - Create a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ message: "Invalid message length" });
  }

  try {
    const newThought = new Thought({ message });
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(500).json({ message: "Error saving thought" });
  }
});

// POST /thoughts/:thoughtId/like - Increment hearts of a thought by ID
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (error) {
    res.status(500).json({ message: "Error liking thought" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

