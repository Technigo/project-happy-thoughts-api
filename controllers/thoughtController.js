import { Thought } from "../models/thoughModel.js";


// Get all thoughts
export const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec();
    res.json({
      success: true,
      message: "Thoughts fetched successfully",
      thoughts: thoughts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Fetching thoughts failed",
      details: error.message
    });
  }
};

// Post a new thought
export const postThought = async (req, res) => {
  try {
    const { message } = req.body;
    const newThought = await new Thought({ message }).save();

    res.status(201).json({
      success: true,
      message: "New thought created successfully",
      thought: newThought
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Creating new thought failed",
      details: error.message
    });
  }
};

