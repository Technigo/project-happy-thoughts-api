import express from "express";
const listEndPoints = require("express-list-endpoints");
import { ThoughtModel } from "../models/Thought";

const router = express.Router();

// Route to list all the endpoints
router.get("/", async (req, res) => {
  const endpoints = listEndPoints(req.app);
  res.json(endpoints);
});

//routes to show the last 20 thoughts
router.get("/thoughts", async (req, res) => {
  const thoughts = await ThoughtModel.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

//Route to post thoughts
router.post("/thoughts", async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
  const { message } = req.body;

  //Use the mongoose model to create the database entry
  const newMessage = new ThoughtModel({ message });
  try {
    //Success:
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Could not save the happy thought to the database",
        error: err.errors,
      });
  }
});

//route to like the thoughts
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Find the thought by its ID
    const thought = await ThoughtModel.findById(thoughtId);

    if (!thought) {
      // If the thought with the provided ID is not found
      return res.status(404).json({ message: "Thought not found" });
    }

    // Increment the hearts/likes count
    thought.hearts += 1;

    // Save the updated thought
    await thought.save();

    res.json(thought);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while processing like", error: err.message });
  }
});

export default router;
