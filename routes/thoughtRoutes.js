import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/happyThoughts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const endpoints = listEndpoints(router);
    res.json(endpoints);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.errors });
  }
});

router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await ThoughtModel.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.json(thoughts);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Cannot load thoughts", error: err.errors.message });
  }
});

router.post("/thoughts", async (req, res) => {
  const newMessage = req.body.message;

  const thought = new ThoughtModel({ message: newMessage });

  //Mongoose returns error from schema if less than 5 or more than 140 characters
  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: "Cannot save thought to the database",
      error: err.errors,
    });
  }
});

router.put("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likedThought = await ThoughtModel.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (likedThought) {
      res.status(200).json(likedThought);
    } else {
      res.status(400).json({ message: "Thought not found" });
    }
  } catch (err) {
    res.status(400).json({
      message: "Cannot update the number of likes for this message",
      error: err.errors,
    });
  }
});

export default router;
