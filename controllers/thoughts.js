import ThoughtsSchema from "../models/thoughts.js";

const getThoughts = async (req, res) => {
  try {
    const thoughts = await ThoughtsSchema
      .find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();

    res.status(200).json({ success: true, thoughts });
  } catch (error) {
    res.json({ message: error });
  }
};

const addThought = async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new ThoughtsSchema({ message }).save();

    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ message: "Could not save thought", error: error.errors })
  }
};

const addLikes = async (req, res) => {
  const { id } = req.params;

  try {
    const addNewLikes = await ThoughtsSchema.findByIdAndUpdate(id, { $inc: { hearts: 1 }});

    res.status(201).json(addNewLikes);
  } catch (error) {
    res.status(400).json({ message: "Could not update thought" })
  }
};

module.exports = {
  getThoughts,
  addThought,
  addLikes
};