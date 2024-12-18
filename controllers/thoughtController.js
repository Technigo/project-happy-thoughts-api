import { Thought } from "../models/thoughModel.js";


// Get all thoughts
export const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec();
    // Just return the array of thoughts directly
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post a new thought
export const postThought = async (req, res) => {
  try {
    const { message } = req.body;
    const newThought = await new Thought({ message }).save();

    // Return the newly created thought object directly
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

