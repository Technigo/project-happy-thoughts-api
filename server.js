import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Thought } from "./thought"; // Import the Thought model

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the server's port
const port = process.env.PORT || 8080;
const app = express();

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// GET /thoughts - Retrieve 20 most recent thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve thoughts" });
  }
});

// POST /thoughts - Create a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  // Validate the message length
  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ error: "Message must be between 5 and 140 characters" });
  }

  try {
    const newThought = new Thought({ message }); // Save only the message
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(500).json({ error: "Could not save thought" });
  }
});

// POST /thoughts/:thoughtId/like - Increment the hearts count
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } }, // Increment hearts count
      { new: true } // Return updated document
    );

    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: "Could not update hearts" });
  }
});

// Catch-all route for undefined endpoints (optional)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
