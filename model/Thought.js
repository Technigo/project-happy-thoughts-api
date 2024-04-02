const express = require('express');
const router = express.Router();
const Thought = require('../model/Thought');

router.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20);
  res.json(thoughts);
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const newThought = await Thought.create({ message });
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;