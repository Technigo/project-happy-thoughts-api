import express from "express";
import { ThoughtModel } from "../models/Thought";
import listEndpoints from "express-list-endpoints";

const router = express.Router();

// Start defining your routes here
router.get("/", async (req, res) => {
  try {
    const endpoints = listEndpoints(router);
    res.json(endpoints);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await ThoughtModel.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/thoughts", async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newThought = new ThoughtModel({
      message: req.body.message,
      hearts: 0,
    });

    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await ThoughtModel.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    thought.hearts = (thought.hearts || 0) + 1;

    const updatedThought = await thought.save();

    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
