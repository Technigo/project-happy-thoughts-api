import { Thought } from "../models/thoughModel.js";

// post a like
export const postLike =  async (req, res) => {
  try {
    const { id } = req.params;
    const updatedThought = await Thought.findByIdAndUpdate(
      id, 
      { $inc: { hearts: 1 } }, 
      { new: true }
    );
    
    if (!updatedThought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    
    // Return the updated thought directly
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};