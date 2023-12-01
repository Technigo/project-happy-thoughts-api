// Importing the 'express' module to create a router
const express = require('express');

// Creating a router instance using express.Router()
const router = express.Router();

// Importing route handlers from the 'thoughtController' module
const { getThoughts, createThought, createLike } = require('../controllers/thoughtController');

// Routes for handling thoughts
router.route('/thoughts')
    .get(getThoughts) // Retrieve all thoughts
    .post(createThought); // Create a new thought

// Route for handling likes on a specific thought
router.route('/thoughts/:thoughtId/like')
    .post(createLike); // Create a like for a specific thought

// Export the router for use in other parts of the application
module.exports = router;
