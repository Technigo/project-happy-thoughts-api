// Importing the 'express' module to create a router
const express = require('express');
// Creating a router instance using express.Router()
const router = express.Router();

const { getThoughts, createThought, createLike } = require('../controllers/thoughtController');

router.route('/thoughts')
    .get(getThoughts)
    .post(createThought)

router.route('/thoughts/:thoughtId/like')
    .post(createLike)


module.exports = router;