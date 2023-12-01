import express from "express";
import Thought from "../models/Thought";



  // Route for the root
  const listEndpoints = require("express-list-endpoints");


// Express router
const setUpRoutes = (app) => {
  const router = express.Router();

  // Start defining your routes here
 app.get("/", (req, res) => {
  res.send(listEndpoints(app)); 
 });

 
  // Route for retrieving thoughts
app.get('/thoughts', async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(400).json({ message: 'Could not fetch thoughts', error: err.errors });
    }
  });

// POST endpoint for creating a new thought
app.post('/thoughts', async (req, res) => {
    try {
      const { message } = req.body;
      const newThought = new Thought({ message });
      const savedThought = await newThought.save();
      res.status(201).json(savedThought);
    } catch (err) {
      res.status(400).json({ message: 'Could not save thought', error: err.errors });
    }
  });

// PUT endpoint for liking a thought, Changed from post to put since Diego did that on the Q and A.
app.put('/thoughts/:thoughtId/like', async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $inc: { hearts: 1 } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
      } else {
        res.status(200).json(thought);
      }
    } catch (err) {
      res.status(400).json({ message: 'Invalid request', error: err.errors });
    }
  });
};

export default setUpRoutes;