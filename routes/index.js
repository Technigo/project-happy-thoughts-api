import express from 'express';
import Thought from '../models/thought';
import { celebrate, Segments, Joi } from 'celebrate';
import { requireJsonContent } from '../middleware/index';
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();

router.get('/', async (req, res, next) => {
  const thoughts = await Thought.find();

  if (thoughts.length > 0) {
    // res.json(thoughts.reverse().slice(0, 20));
    res.json(thoughts);
  } else {
    res.status(404).json({
      statusCode: 404,
      error: `No happy thoughts found.`
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
    console.log(req.headers);
    const thought = new Thought({ message: req.body.message });
    await thought.save();
    res.json(thought);
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
    const thought = await Thought.findById(req.params.thoughtId);

    if (thought) {
      thought.hearts += 1;
      thought.save();
      res.json(thought);
    } else {
      res.status(404).json({
        statusCode: 404,
        error: `No happy thought found with ${thoughtId}`
      });
    }
  }
);

module.exports = router;
