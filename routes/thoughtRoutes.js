const express = require("express");
const Thought = require("../models/thoughtModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from the Happy Thoughts API!");
});

router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = new Thought({ message });
    const savedThought = await newThought.save();
    res.json(savedThought);
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));

      return res.status(400).json({ error: "Bad Request", validationErrors });
    }

    res.status(400).json({ error: "Bad Request" });
  }
});

router.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;

    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
