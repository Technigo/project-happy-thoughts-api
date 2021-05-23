import express from "express";
import listEndpoints from 'express-list-endpoints'

const Thought = require('../Models/Thought')

const router = express.Router();

const catchError = (res, err, msg) => {
  return res.status(400).json({ message: msg, errors: err.errors })
}

router.get('/', async (req, res) => {
  try {
    res.json(listEndpoints(router))
  } catch (err) {
    res.status(404).send({ error: "Not found" })
  }
})

router.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new Thought({ message }).save()
    res.json(thought)
  } catch (err) {
    catchError(res, err, "Something went wrong")
  }
})

router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec()
    return thoughts.length === 0 ? res.json({ message: "There are no thoughts" }) : res.json(thoughts)
  } catch (err) {
    catchError(res, err, "Something went wrong")
  }
})

router.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedLikes = await Thought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } })
    res.json(updatedLikes)
  } catch (err) {
    catchError(res, err, "The id does not exist")
  }
})

router.delete('/thoughts/delete', async (req, res) => {
  try {
    const deleted = await Thought.deleteMany()
    res.json(deleted)
  } catch (err) {
    catchError(res, err, "Failed deleting")
  }
})

router.delete('/thoughts/:thoughtId/delete', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const deleteOne = await Thought.findByIdAndDelete(thoughtId)
    res.json(deleteOne)
  } catch (err) {
    catchError(res, err, "Failed deleting - invalid Id")
  }
})

module.exports = router;