import express from "express"; // Express is a web framework for Node.js
import { ThoughtModel } from "../models/Thought"; // Import the ThoughtModel from the Thought.js file
import listEndpoints from "express-list-endpoints"; // A utility to list all available routes in an Express application

// Create a router instance using Express
const router = express.Router();

// GET /thoughts - Retrieve the latest 20 thoughts
router.get("/thoughts", async (req, res) => {
  try {
    // Fetch the latest 20 thoughts from the database, sorted by createdAt in descending order
    const thoughts = await ThoughtModel.find()
      .limit(20)
      .sort({ createdAt: -1 });

    // Respond with the fetched thoughts in JSON format
    res.json(thoughts);
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /thoughts - Create a new thought
router.post("/thoughts", async (req, res) => {
  try {
    // Extract the "message" property from the request body
    const { message } = req.body;

    // Validate the input message
    if (!message || message.length < 5 || message.length > 140) {
      // If the message is invalid, respond with a 400 Bad Request status and an error message
      return res.status(400).json({
        error: "Invalid input. Message should be between 5 and 140 characters.",
      });
    }

    // Create a new thought using the ThoughtModel and the provided message
    const thought = new ThoughtModel({ message });
    // Save the new thought to the database
    const savedThought = await thought.save();

    // Respond with the saved thought in JSON format
    res.json(savedThought);
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /thoughts/:thoughtId/like - Increment the like (hearts) count for a thought
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    // Extract the thoughtId from the request parameters
    const { thoughtId } = req.params;

    // Find the thought in the database using the provided thoughtId
    const thought = await ThoughtModel.findById(thoughtId);

    // Check if the thought exists
    if (!thought) {
      // If the thought is not found, respond with a 404 Not Found status and an error message
      return res.status(404).json({ error: "Thought not found" });
    }

    // Increment the hearts count for the found thought
    thought.hearts += 1;

    // Save updated thought
    const updatedThought = await thought.save();

    // Respond with the updated thought in JSON format
    res.json(updatedThought);
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET / - List all available routes in the application
router.get("/", (req, res) => {
  try {
    // Use the express-list-endpoints utility to list all available routes in the router
    const endpoints = listEndpoints(router);

    // Respond with the list of endpoints in JSON format
    res.json(endpoints);
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router for use in other parts of the application
export default router;
