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

router.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  const thought = await Thought.findById(thoughtId);

  if (thought) {
    thought.hearts += 1;
    thought.save();
    res.json(thought);
  } else {
    res.status(404).json({
      statusCode: 404,
      error: `No happy thought find with ${thoughtId}`
    });
  }
});

module.exports = router;
