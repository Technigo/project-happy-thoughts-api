// Importing necessary modules and dependencies
import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/ThoughtModel";

// Creating an instance of the Express router
const router = express.Router();

// ------- THE ROUTES ------- //

// ------- LIST OF ALL ENDPOINTS ------- //
// Show all endpoints available in a JSON format
router.get("/", async (req, res) => {
  try {
    // Get all endpoints available in the router and send it as a JSON response
    const endpoints = listEndpoints(router);
    res.json(endpoints);
  } catch (error) {
    // Catch any errors that occur and respond with a 500 status and an error message
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ------- LIST RECENT THOUGHTS ------- //
// GET 20 of the most recent posted thoughts
router.get("/thoughts", async (req, res) => {
  // Find the 20 most recent thoughts, sort them in descending order by createdAt, and limit the results to 20
  const thoughts = await ThoughtModel.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts); // Send the retrieved thoughts as a JSON response
});

// ------- POST THOUGHT ------- //
// POST a new thought
router.post("/thoughts", async (req, res) => {
  const { message } = req.body; // Extract the 'message' from the request body
  const thought = new ThoughtModel({ message }); // Create a new ThoughtModel instance with the provided 'message'

  try {
    // Save the new thought to the database
    const savedThought = await thought.save();
    res.status(201).json(savedThought); // Respond with the saved thought as JSON
  } catch (error) {
    // Handle any errors that occur during the saving process
    res.status(400).json({
      message: "Could not save thought to the database",
      error: error.errors,
    });
  }
});

// ------- LIKE FUNCTION ------- //
// POST a like for a certain posted thought by updating the 'hearts' property
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params; // Get the thoughtId from the request parameters

  try {
    const updateLike = await ThoughtModel.findById(thoughtId); // Find the thought by its ID

    if (!updateLike) {
      return res.status(404).json({ message: "Thought not found" }); // If the thought doesn't exist, respond with a 404 status and a message
    }

    updateLike.hearts += 1; // Increment the 'hearts' property of the thought
    await updateLike.save(); // Save the updated thought

    res.json(updateLike); // Respond with the updated thought as JSON
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while processing like", error: error.message }); // Catch and respond with an error message if any error occurs
  }
});

// Export the router for use in the main application
module.exports = router;
