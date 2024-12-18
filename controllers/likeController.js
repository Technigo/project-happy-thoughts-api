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
      return res.status(404).json({
        success: false,
        error: "Thought not found",
        details: "The thought with the provided ID was not found."
      });
    }
    
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Updating likes failed",
      details: error.message
    });
  }
};