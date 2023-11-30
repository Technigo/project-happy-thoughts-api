// Importing necessary modules and dependencies
import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/ThoughtModel";

// Creating an instance of the Express router
const router = express.Router();

// ------- THE ROUTES ------- //

// ------- LIST OF ALL ENDPOINTS ------- //
// Show all endpoints available in a JSON format
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json(endpoints);
});

// ------- LIST RECENT THOUGHTS ------- //
// GET 20 of the most recent posted thoughts
router.get("/thoughts", async (req, res) => {
  const thoughts = await ThoughtModel.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

// ------- POST THOUGHT ------- //
// POST a new thought
router.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new ThoughtModel({ message });

  try {
    // Success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({
      message: "Could not save thought to the database",
      error: error.errors,
    });
  }
});

// ------- LIKE FUNCTION ------- //
// POST a like for a certain posted thought by updating the 'hearts' property
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await ThoughtModel.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    thought.hearts += 1;
    await thought.save();

    res.json(thought);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while processing like", error: error.message });
  }
});

// Export the router for use in the main application
module.exports = router;
