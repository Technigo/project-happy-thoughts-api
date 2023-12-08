import express from "express";
import expressAsyncHandler from "express-async-handler";
import Thought from "../models/thought";

const router = express.Router();

router.get("/thoughts", async (req, res) => {
    try {
      const thoughts = await Thought.find()
      .sort({ createdAt: -1 })
      .limit(20);
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post("/thoughts", async (req, res) => {
    try {
      console.log('Received data:', req.body);
      const postedThought = await Thought(req.body).save();
      res.status(201).json(postedThought);
    } catch (error) {
      console.error('Error saving thought:', error);
      res.status(400).json({ error: 'Invalid input' });
    }
  });
  
  router.post("/thoughts/:thoughtId/like", async (req, res) => {
    const { thoughtId } = req.params;
  
    try {
      const thought = await Thought.findById(thoughtId);
      
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
  
      thought.hearts += 1;
      await thought.save();
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;