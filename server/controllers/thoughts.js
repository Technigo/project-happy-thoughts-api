import thoughts from "../models/thoughts.js";

export const getThoughts = async (req, res) => {
  try {
    const allThoughts = await thoughts
      .find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();

    res.status(200).json({ success: true, thoughts: allThoughts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const addThought = async (req, res) => {
  const { message, username }  = req.body;
  
  try {
    const newThought = await new thoughts({ message: message, username: username || "anonymous" }).save();
    
    res.status(201).json(newThought);
  } catch (error) {
    res.status(409).json({ message: "Could not save thought", error: error.errors });
  };
};

export const addLikes = async (req, res) => {
  const { id } = req.params;

  try {
    const addNewLikes = await thoughts.findByIdAndUpdate(id, { $inc: { hearts: 1 }});

    res.status(201).json(addNewLikes);
  } catch (error) {
    res.status(400).json({ message: "Could not update thought" });
  };
};