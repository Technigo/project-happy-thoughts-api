import express from "express";
import asyncHandler from "express-async-handler"
import { ThoughtModel } from "../models/ThoughtsModel";

const router = express.Router();

//Get the 20 latest thoughts in desc order
router.get("/thoughts", async (req, res) => {
    const thoughts = await ThoughtModel.find().sort({ createdAt: "desc" }).limit(20).exec();
    res.json(thoughts);
});


// Post a message, if unsuccessful show error message
router.post("/thoughts", async (req, res) => {
    try {
        // Success
        const savedThought = await ThoughtModel(req.body).save();
        res.status(201).json(savedThought); //201 = created
    } catch (err) {
        // Failure
        res.status(400).json({ message: "Unable to save thought", error: err.errors })
    }
});

// Route to handle getting a specific thought by its ID
router.get('/thoughts/:thoughtId', async (req, res) => {
    const thoughtId = req.params;
  
    try {
      const thought = await ThoughtModel.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

// Route to handle liking a thought by its ID
//For updating the heart/like I choosed to use PUT instead of POST to increment the hearts property
router.put('/thoughts/:thoughtId/like', async (req, res) => {
    const { thoughtId } = req.params;
  
    try {
      const updateLikes = await ThoughtModel.findByIdAndUpdate(
        thoughtId,
        { $inc: { hearts: 1 } }, // Increment the 'hearts' property by 1
        { new: true } // Return the updated thought
      );
  
      if (!updateLikes) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      res.status(200).json(updateLikes);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });


export default router;