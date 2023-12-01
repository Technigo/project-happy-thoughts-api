

const Thought = require('../models/thoughtModel')


// @desc Get thoughts
// @route GET /thoughts
// @access Public

const getThoughts = async (req, res) => {
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
}

// @desc Post thoughts
// @route POST /thoughts
// @access Public

const createThought = async (req, res) => {
    try {
        // Check if the 'message' property is missing or only contains spaces in the request body
        if (!req.body.message || req.body.message.trim().length === 0) {
            return res.status(400).json({ error: 'Please add a thought' });
        }

        const thought = await Thought.create({
            message: req.body.message.trim(),
        });
        // res.send('This is a POST request response');
        return res.status(201).json(thought);

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
}

// @desc Post likes
// @route POST /thoughts:thoughtId/like
// @access Public

const createLike = async (req, res) => {
    try {
       
        // The $inc operator has the following form: { $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $inc: { hearts: 1 } }, // Increment the 'hearts' property by 1
            { new: true } // Return the updated document
        );

        // Check if the thought with the specified ID exists
        if (!thought) {
            return res.status(400).json({ error: 'Thought was not found' });
        }

        return res.status(201).json(thought);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getThoughts,
    createThought,
    createLike
}