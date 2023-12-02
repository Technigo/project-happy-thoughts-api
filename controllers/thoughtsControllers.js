const Thoughts = require("../models/thoughtsModel");

exports.getThoughts = async (req, res) => {
  try {
    const thoughts = await Thoughts.find().sort("-createdAt").limit(20);
    res.status(200).json({
      status: "success",
      length: thoughts.length,
      data: thoughts,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createThought = async (req, res, next) => {
  try {
    const newThought = new Thoughts({ message: req.body.message });
    await newThought.save();
    res.status(201).json({
      status: "success",
      data: newThought,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err.errors.message.message,
    });
  }
};

exports.postLikes = async (req, res) => {
  try {
    const newLike = await Thoughts.findByIdAndUpdate(
      req.params.thoughtId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!newLike)
      return res
        .status(404)
        .json({ status: "fail", message: "Could not find a thought with the ID 👀" });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
