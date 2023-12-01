// Importing the 'express' module to create a router
const express = require('express');
// Creating a router instance using express.Router()
const router = express.Router();

const Thought = require('../models/thoughtModel')


// @desc Get thoughts
// @route GET /thoughts
// @access Public

router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find()
            .limit(20) // Limit the results to 20
            .sort({ createdAt: 'desc' }); // Sort by createdAt in descending order
        // res.send('This is a GET request response');
        res.status(200).json(thoughts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// @desc Post thoughts
// @route POST /thoughts
// @access Public

router.post('/thoughts', async (req, res) => {
    try {
        // Check if the 'message' property is missing or only contains spaces in the request body
        if (!req.body.message || req.body.message.trim().length === 0) {
            return res.status(400).json({ error: 'Please add a thought' });
        }

        const thought = await Thought.create({
            message: req.body.message.trim(),
        });
        // res.send('This is a POST request response');
        return res.status(200).json(thought);

    } catch (error) {
        // Check if the error is of type 'ValidationError'
        if (error.name === 'ValidationError') {
            // Validation error occurred
            // Extract error messages from each validation error and map them
            const validationErrors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ error: 'Validation Error', validationErrors });
        }
        // If it's not a validation error, log the error and send a 500 Internal Server Error response
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// @desc Post thoughts
// @route POST /thoughts:thoughtId/like
// @access Public

router.post('/thoughts/:thoughtId/like', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId)
        // Check if the thought with the specified ID exists
        if (!thought) {
            return res.status(400).json({ error: 'Thought was not found' });
        }
        // res.send('This is a POST request response for the like function');
        return res.status(200).json(thought)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;