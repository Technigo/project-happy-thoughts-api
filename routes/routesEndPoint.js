import express from 'express';
import asyncHandler from 'express-async-handler';
import { ModelThoughts } from '../model/modelthoughts.js';

const router = express.Router();

//GET /thoughts
router.get('/thoughts', asyncHandler(async (req, res) => {
    const thoughts = await ModelThoughts.find().sort({ createdAt: 'desc' }).limit(20).exec();
    res.json(thoughts);
}));

//POST /thoughts
router.post('/thoughts', asyncHandler(async (req, res) => {
    const { message, hearts } = req.body;
    const thought = new ModelThoughts({ message, hearts }); // Corrected to use ModelThoughts
    try {
        const savedThought = await thought.save();
        res.json(savedThought);
    }
    catch (err) {
        res.status(400).json({ message: 'Could not save thought to the Database', error: err.errors });
    }
}));

//GET /thoughts/:thoughtId
router.get('/thoughts/:thoughtId', asyncHandler(async (req, res) => {
    const { thoughtId } = req.params;
    try {
        const thought = await ModelThoughts.findById(thoughtId);
        if (thought) {
            res.json(thought);
        }
        else {
            res.status(404).json({ message: 'Thought not found' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Invalid request', error: err.errors });
    }
}));

//PUT /thoughts/:thoughtId
router.put('/thoughts/:thoughtId', asyncHandler(async (req, res) => {
    const { thoughtId } = req.params;
    try {
        const heartsLike = await Thought.findByIdandUpdate(thoughtId,
            { $inc: { hearts: 1 } },
            { new: true }
            );
        if (heartsLike) {
            res.json(heartsLike);
        }
        else {
            res.status(404).json({ message: 'Likes not updated' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Invalid request', error: err.errors });
    }
}));

//DELETE /thoughts/:thoughtId
router.delete('/thoughts/:thoughtId', asyncHandler(async (req, res) => {
    const { thoughtId } = req.params;
    try {
        const deletedThought = await Thought.findByIdAndDelete(thoughtId);
        if (deletedThought) {
            res.json(deletedThought);
        }
        else {
            res.status(404).json({ message: 'Thought not found' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Invalid request', error: err.errors });
    }
}));

export default router;

