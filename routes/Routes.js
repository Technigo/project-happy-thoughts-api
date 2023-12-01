import express from "express";
import Thought from "../models/Thought";

const listEndpoints = require("express-list-endpoints");
// Create an instance of the Express router
// The router method in this code is like setting up a map or a blueprint for handling different kinds of requests in a web application. It helps organize and define how the application should respond when someone visits different URLs. Think of it as creating a list of instructions for the app to follow when it receives specific requests, like "show me all tasks" or "register a new user." This makes the code neat and helps the app know what to do when someone interacts with it.
const setUpRoutes = (app) => {
  const router = express.Router();

  // Start defining your routes here
  app.get("/", (req, res) => {
    res.send(listEndpoints(app));
  });

  //routes for all thoughts
  app.get("/thoughts", async (req, res) => {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.json(thoughts);
  });

  //route for posting thought
  app.post("/thoughts", async (req, res) => {
    //Retrieve the info sent by the user to uor API ebdpoint
    const { message, heart } = req.body;

    //Using mongoose model to create the data entry
    const thought = new Thought({ message, heart });

    try {
      // success
      const savedThought = await thought.save();
      res.status(201).json(savedThought);
    } catch (err) {
      console.error("Error saving thought to the database:", err);
      res.status(400).json({
        message: "Could not save thought to the Database",
        error: err.errors,
      });
    }
  });

  //route for adding likes to a post
  app.post("/thoughts/:thoughtId/like", async (req, res) => {
    const { thoughtId } = req.params;

    try {
      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $inc: { heart: 1 } }, // Increment the hearts property by 1
        { new: true } // Return the updated thought
      );

      if (!thought) {
        // If the thought with the given ID is not found
        return res.status(404).json({ message: "Thought not found" });
      }

      res.json(thought);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
};
export default setUpRoutes;
