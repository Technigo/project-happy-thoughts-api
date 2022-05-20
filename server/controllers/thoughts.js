import thoughts from "../models/thoughts.js";

export const getThoughts = async (req, res) => {
  const { skip, limit } = req.query;

  try {
    const allThoughts = await thoughts.aggregate([
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: +skip || 0
      },
      {
        $limit: +limit || 20
      }
    ])
    res.json({ success: true, thoughts: allThoughts })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
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
    const addNewLikes = await thoughts.findByIdAndUpdate(id, { $inc: { hearts: 1 } }, { new: true } );

    res.status(201).json(addNewLikes);
  } catch (error) {
    res.status(400).json({ message: "Could not update thought" });
  };
};