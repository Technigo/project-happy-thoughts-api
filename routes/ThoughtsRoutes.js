/*import express from "express";
import { ThoughtsModel } from "../models/Thoughts";

const router = express.Router();

// Define your routes
router.get("/thoughts", async (req, res) => {
  // Your GET endpoint logic
});

router.post("/thoughts", async (req, res) => {
  // Your POST endpoint logic
});

router.post("/thoughts/:thoughtId/like", async (req, res) => {
  // Your POST (like) endpoint logic
});

export default router;

/*import express from "express";
import { ThoughtsModel } from "../models/Thoughts";
import { listEndpoints } from "express-list-endpoints"; // Import listEndpoints function

const router = express.Router();

router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await ThoughtsModel.find({})
      .sort({ createdAt: "desc" })
      .limit(20);

    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5) {
    return res
      .status(400)
      .json({ message: "Thought must be at least 5 characters long" });
  }

  try {
    const newThought = await ThoughtsModel.create({ message });
    res.status(201).json(newThought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await ThoughtsModel.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list all endpoints
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router); // List all endpoints in this router
  res.json({ endpoints });
});

export default router;
*/
import express from "express";
import { ThoughtsModel } from "../models/Thoughts";

const router = express.Router();

router.get("/thoughts", async (req, res) => {
  await ThoughtsModel.find({})
    .skip(0)
    .limit(20)
    .sort({ createdAt: "desc" })
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});

router.post("/thoughts", async (req, res) => {
  const thought = req.body;

  if (!thought.message) {
    res.status(400).json({ message: "empty thought is not allowed" });
    return;
  }
  if (thought.message.length < 5) {
    res.status(400).json({ message: "short thought is not allowed" });
    return;
  }

  await ThoughtsModel.create({ message: thought.message })
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  console.log(req.params);
  await ThoughtsModel.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    .then((result) => {
      if (result.matchedCount < 1) {
        res.status(400).json({ message: "thought not found" });
        return;
      }
      res.json(result);
    })
    .catch((error) => res.json(error));
});

export default router;
