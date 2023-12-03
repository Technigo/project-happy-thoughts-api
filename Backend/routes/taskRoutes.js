import express from "express";
import listEndpoints from "express-list-endpoints";
import {thoughtModel} from "../models/task";

const router = express.Router();

// Route to get available endpoints
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json({ endpoints });
});

// Route to get all thoughts from the database
router.get("/thoughts", async (req, res) => {
  try {
    const result = await thoughtModel.find().sort({ createdAt: -1 }).limit(20);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new thought
router.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body;
    const newThought = await thoughtModel.create({ message });
    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ error: "Invalid Input" });
  }
});

// Route to like a thought
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const thought = await thoughtModel.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    thought.hearts += 1;
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
