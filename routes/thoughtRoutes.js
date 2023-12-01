// Importing the 'express' module to create a router
const express = require('express');
// Creating a router instance using express.Router()
const router = express.Router();

const Thought = require('../models/thoughtModel')


// @desc Get thoughts
// @route GET /thoughts
// @access Public

router.get('/thoughts', (req, res) => {
   
    res.send('This is a GET request response');
  });
  

// @desc Post thoughts
// @route POST /thoughts
// @access Public

router.post('/thoughts', (req, res) => {
   
    res.send('This is a POST request response');
  });



// @desc Post thoughts
// @route POST /thoughts:thoughtId/like
// @access Public

router.post('/thoughts/:thoughtId/like', (req, res) => {
   
    res.send('This is a POST request response');
  });


module.exports = router;