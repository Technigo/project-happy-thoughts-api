import ThoughtsSchema from "../models/thoughts.js";

const getThoughts = async (req, res) => {
  try {
    const thoughts = await ThoughtsSchema.find().sort({ createdAt: "desc" }).limit(20).exec();
    res.json(thoughts)
  } catch (error) {
    res.json({ message: error })
  }
};

const addThought = async (req, res) => {
  const { message } = req.body;

  const thought = new ThoughtsSchema({ message })

  try {
    const savedThought = await thought.save();

    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ message: "Could not save thought to the database", error: error.errors })
  }
};

module.exports = {
  getThoughts,
  addThought
}