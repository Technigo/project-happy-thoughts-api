import express from 'express';
import Thought from '../models/ThoughtSchema.js';

// Define the routes
const router = express.Router();

// GET /thoughts
router.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
});

// POST /thoughts
router.post('/thoughts', async (req, res) => {
  const { message, name } = req.body;
  const thought = new Thought({ message, name });
  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the Database', error: err.errors });
  }
});

// POST /thoughts/:thoughtId/like
router.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findOneAndUpdate({ _id: thoughtId }, { $inc: { hearts: 1 } }, { new: true });
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Invalid request', error: err.errors });
  }
});

export default router;
