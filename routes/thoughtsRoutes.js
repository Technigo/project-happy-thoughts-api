import express from "express";
import Thought from "../model/Thought.js"; // Adjust the import path as per your project structure
import listEndpoints from "express-list-endpoints";

const router = express.Router();

// Endpoint to list all available routes on this router
router.get("/", (req, res) => {
  res.json(listEndpoints(router));
});

// Route to get the latest 20 thoughts
router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({}).sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to create a new thought
router.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.length < 5 || message.length > 140) {
      return res.status(400).json({
        error: "Invalid input. Message should be between 5 and 140 characters.",
      });
    }
    const newThought = await Thought.create({ message });
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ error: "Could not save thought to the database" });
  }
});

// Route to like a thought
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    res.json(updatedThought);
  } catch (error) {
    res.status(400).json({ error: "Could not update thought" });
  }
});

export default router;
