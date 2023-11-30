import express from "express";
import Thought from "../models/Thought";
import listEndpoints from 'express-list-endpoints';

const router = express.Router();

// Route for the root
router.get("/", (req, res) => {
  res.json(listEndpoints(app));
  });
  
  // Route for retrieving thoughts
router.get('/thoughts', async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(400).json({ message: 'Could not fetch thoughts', error: err.errors });
    }
  });

// POST endpoint for creating a new thought
router.post('/thoughts', async (req, res) => {
    try {
      const { message } = req.body;
      const newThought = new Thought({ message });
      const savedThought = await newThought.save();
      res.status(201).json(savedThought);
    } catch (err) {
      res.status(400).json({ message: 'Could not save thought', error: err.errors });
    }
  });

// POST endpoint for liking a thought
router.post('/thoughts/:thoughtId/like', async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $inc: { hearts: 1 } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
      } else {
        res.status(200).json(thought);
      }
    } catch (err) {
      res.status(400).json({ message: 'Invalid request', error: err.errors });
    }
  });

export default router;