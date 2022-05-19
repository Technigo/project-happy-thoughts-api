import thoughts from "../models/thoughts.js";

const getThoughts = async (req, res) => {
  try {
    const allThoughts = await thoughts
      .find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();

    res.status(200).json({ success: true, allThoughts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addThought = async (req, res) => {
  const message = req.body;

  const newThought = await new thoughts({ message }).save();

  try {
    res.status(201).json(newThought);
  } catch (error) {
    res.status(409).json({ message: "Could not save thought", error: error.errors })
  }
};

const addLikes = async (req, res) => {
  const { id } = req.params;

  try {
    const addNewLikes = await thoughts.findByIdAndUpdate(id, { $inc: { hearts: 1 }});

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