import { ThoughtsModel } from "../model/ThoughtsModel";
import asyncHandler from "express-async-handler";

// desciption: Get 20 latest thoughts
// route: /thoughts
// access: Private
export const getThoughtsController = asyncHandler(async (req, res) => {
  await ThoughtsModel.find()
    .limit(20)
    .sort({ createdAt: -1 })
    .then((result) => res.json(result))
    .catch((err) =>
      res.status(404).json({ err: "Cannot get happy thoughts :(" })
    );
});

// desciption: ADD Thoughts
// route: /thoughts
// access: Private
export const addThoughtController = asyncHandler(async (req, res) => {
  const { message, hearts } = req.body;

  try {
    const newThought = new ThoughtsModel({ message, hearts });
    const result = await newThought.save();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Message is required." });
  }
});

// desciption: Get a specific thought
// route: /thoughts/:thoughtId
// access: Private

export const getOneThoughtController = asyncHandler(async (req, res) => {
  const { thoughtId } = req.params;
  const thought = await ThoughtsModel.findOne({ _id: thoughtId });
  if (!thought) {
    return res
      .status(404)
      .json({ error: "Thought not found with the specified ID." });
  }

  res.json(thought);
});

// desciption: PUT a specific thought to give heart
// route: /thoughts/:thoughtId/like
// access: Private

export const addHeartController = asyncHandler(async (req, res) => {
  const { thoughtId } = req.params;
  const thought = await ThoughtsModel.findByIdAndUpdate(
    { _id: thoughtId },
    //the $inc operator is used to increment the value of a numeric field in a document
    { $inc: { hearts: 1 } },
    { new: true }
  );

  if (!thought) {
    return res
      .status(404)
      .json({ error: "Thought not found with the specified ID." });
  }

  res.json(thought);
});
