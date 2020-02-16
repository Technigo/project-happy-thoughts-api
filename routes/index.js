import express from 'express';
import Thought from '../models/thought';
import { celebrate, Segments, Joi } from 'celebrate';
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();

router.get('/', async (req, res, next) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec();

  if (thoughts) {
    res.json(thoughts);
  } else {
    res.status(404).json({
      message: `No thoughts found`,
      error: err.errors
    });
  }
});

router.post(
  '/',
  celebrate({
    [Segments.HEADERS]: Joi.object({
      'content-type': Joi.string()
        .required()
        .valid('application/json')
    }).unknown(),
    [Segments.BODY]: Joi.object()
      .keys({
        message: Joi.string()
          .min(5)
          .max(140)
          .trim()
          .required()
      })
      .options({ abortEarly: false })
  }),
  async (req, res) => {
    const { message } = req.body;
    const newThought = new Thought({ message });

    try {
      const savedThought = await newThought.save();
      res.status(201).json(savedThought);
    } catch (err) {
      res.status(500).json({
        message: 'Could not create thought due to an unexpected error',
        error: err.errors
      });
    }
  }
);

router.post(
  '/:thoughtId/like',
  celebrate({
    [Segments.PARAMS]: Joi.object()
      .keys({
        thoughtId: Joi.objectId()
      })
      .options({ abortEarly: false })
  }),
  async (req, res) => {
    const { thoughtId } = req.params;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { hearts: 1 }
      },
      { new: true }
    ).exec();

    if (updatedThought) {
      res.status(200).json(updatedThought);
    } else {
      res.status(404).json({
        statusCode: 404,
        error: `Could not find thoughtId ${thoughtId}`
      });
    }
  }
);

module.exports = router;
