// routes/thoughts.js
import express from 'express';
import Thought from '../models/thought';
import handleErrors from '../utils/errorHandler'; // Import the error handling function

// Create an instance of the Express router
const router = express.Router();

// Get all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
        res.json(thoughts);
    } catch (error) {
        // Use the handleErrors function for consistent error handling
        handleErrors(res, error);
    }
});

// Post a new thought
router.post('/', async (req, res) => {
    const { message } = req.body;

    try {
        // Validate the length of the thought message
        if (message.length < 5 || message.length > 140) {
            throw new Error('Invalid message length');
        }

        // Create a new Thought instance with the complete field set to true
        const thought = new Thought({ message, complete: true });

        // Save it to the database
        const savedThought = await thought.save();

        // Respond with the saved thought
        res.status(201).json(savedThought);
    } catch (error) {
        // Use the handleErrors function for consistent error handling
        handleErrors(res, error, 400, 'Bad Request');
    }
});

// Post a like for a specific thought
router.post('/:thoughtId/like', async (req, res) => {
    const { thoughtId } = req.params;

    try {
        // Find the thought by its ID
        const thought = await Thought.findById(thoughtId);

        // Handle the case where the thought is not found
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // Increment the hearts count and save the updated thought
        thought.hearts += 1;
        const savedThought = await thought.save();

        // Respond with the updated thought
        res.status(201).json(savedThought);
    } catch (error) {
        // Use the handleErrors function for consistent error handling
        handleErrors(res, error, 400, 'Thought not found. Could not add a like!');
    }
});


export default router;
