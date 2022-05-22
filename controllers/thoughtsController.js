import Thought from "../models/thought";

// @desc		Get thoughts
// @route		GET /thoughts
const getThoughts = async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
  res.status(200).json({
    success: true,
    results: thoughts,
  });
};

// @desc		Send thought
// @route		POST /thoughts
const postThought = async (req, res) => {
  const { message } = req.body;
  const thought = await Thought.create({ message });

  if (!thought) {
    res.status(400);
    throw new Error("Please add a body");
  }

  res.status(201).json({
    success: true,
    created: thought,
  });
};

// @desc		Add like
// @route		POST /thoughts/:id/like
const postLike = async (req, res) => {
  const thought = await Thought.findByIdAndUpdate(
    req.params.id,
    { $inc: { hearts: 1 } },
    { new: true }
  );

  if (!thought) {
    res.status(404);
    throw new Error("Thought not found");
  }

  res.status(201).json({ success: true, updated: thought });
};

// @desc		Delete thought
// @route		DELETE /thoughts/:id
const deleteThought = async (req, res) => {
  const thought = await Thought.findById(req.params.id);

  if (!thought) {
    res.status(404);
    throw new Error("Thought not found");
  }

  await thought.remove();
  res.status(400).json({ success: true, id: req.params.id });
};

module.exports = {
  getThoughts,
  postThought,
  postLike,
  deleteThought,
};
