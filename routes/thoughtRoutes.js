import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/ThoughtModel";

const router = express.Router();

// List of all endpoints
router.get("/", async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "OK",
      body: {
        content: "Susannes Happy thoughts API",
        endpoints: listEndpoints(router),
      },
    });
  } catch (error) {
    // Error handling
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// List of all thoughts - this should be limited to show only the 20 most recent thoughts showed in descending order
router.get("/thoughts", async (req, res) => {
  try {
    const result = await ThoughtModel.find()
      .sort({ createdAt: "desc" })
      .limit(20);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
});

// Endpoint to post a new thought
router.post("/thoughts", async (req, res) => {
  try {
    const newThought = new ThoughtModel(req.body);
    newThought.hearts = 0; // Prevents the user from changing the heart
    newThought.createdAt = new Date(); // Prevents the user from changing the date
    await newThought.save(); // Saves the new thought to the database
    res.status(200).json(newThought); // Show status 200 (OK) if the thought was saved
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad request", error });
  }
});

// Following RESTful principles and use PUT to 'update' likes even though the requirements say POST
router.put("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const updatedThought = await ThoughtModel.findOneAndUpdate(
      // findOneAndUpdate returns the updated object
      { _id: thoughtId }, // Finds the thought with the matching id
      { $inc: { hearts: 1 } }, // Increases the hearts by 1
      { new: true } // Returns the updated object
    );
    if (updatedThought) {
      res.status(200).json(updatedThought); // Show status 200 (OK) if the thought was found and updated
    } else {
      res.status(404).json({ message: "Not found" }); // Show status 404 (Not found) if the thought was not found
    }
  } catch (error) {
    res.status(400).json({ message: "Bad request", error }); // Show status 400 (Bad request) if the request was not valid
  }
});

export default router;
