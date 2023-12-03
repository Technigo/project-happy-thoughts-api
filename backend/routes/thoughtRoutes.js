import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/Thought";
import asyncHandler from "express-async-handler";
const router = express.Router();

// Route to get available endpoints
router.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const endpoints = listEndpoints(router);
      res.json({ endpoints });
    } catch (err) {
      res.status(500).json({ err: "Something went wrong" });
    }
  })
);

// Route to get all titles from the database
router.get("/thoughts", async (req, res) => {
  await ThoughtModel.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
});

router.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new ThoughtModel({ message });

  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Thought could not be added.", error: err.errors });
  }
});

router.put(
  "/thoughts/:thoughtId/like",
  asyncHandler(async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const thought = await ThoughtModel.findOneAndUpdate(
        { _id: thoughtId },
        { $inc: { hearts: 1 } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        error: err.errors,
      });
    }
  })
);

export default router;
