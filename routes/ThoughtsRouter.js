import express from 'express';
import Thought from '../models/ThoughtSchema.js';

const router = express.Router();

// Define the routes
router.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
});

// Define the GET /thoughts endpoint
router.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().sort('-createdAt').limit(20);
    res.json(thoughts);
  });

// Define the POST /thoughts endpoint
router.post('/thoughts', async (req, res) => {
  try {
    const { message, name } = req.body;
    const thought = await new Thought({ message, name }).save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the Database', error: err.errors });
  }
});

// Define the POST /thoughts/:thoughtId/like endpoint
router.post('/thoughts/:thoughtId/like', async (req, res) => {
    const { thoughtId } = req.params;
    const thought = await Thought.findById(thoughtId);
  
    if (!thought) {
      res.status(404).json({ error: 'Thought not found' });
      return;
    }
  
    thought.hearts += 1;
    await thought.save();
    res.json(thought);
  });


export default router;