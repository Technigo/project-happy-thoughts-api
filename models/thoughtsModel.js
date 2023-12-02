const mongoose = require("mongoose");

const thoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    maxlength: [140, "A message should be shorter than 140 letters"],
    minlength: [5, "A message should be longer than five letters"],
    required: true,
  },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Thoughts = mongoose.model("Thoughts", thoughtsSchema);

module.exports = Thoughts;
