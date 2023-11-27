const Thoughts = require("../models/thoughtsModel");

exports.getThoughts = async (req, res) => {
  try {
    const thoughts = await Thoughts.find().sort("createAt").limit(20);

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
  console.log(req.body.message, Thoughts);
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
      message: err.message,
    });
  }
};

exports.postLikes = async (req, res) => {
  console.log(req.params);
  try {
    const newLike = await Thoughts.findByIdAndUpdate(req.params.thoughtId, { $inc: { likes: 1 } });

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
