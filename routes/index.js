import express from 'express';
import Thought from '../models/thought';

const router = express.Router();

router.get('/', async (req, res) => {
  const thoughts = await Thought.find();

  if (thoughts.length > 0) {
    res.json(thoughts);
  } else {
    res.status(404).json({
      statusCode: 404,
      error: `No happy thoughts found.`
    });
  }
});

router.post('/', async (req, res) => {
  const thought = new Thought({ message: req.body.message });
  await thought.save();
  res.json(thought);
});

router.post('/:thoughId/like', (req, res) => {});

module.exports = router;
