const mongoose = require("mongoose");

const thoughtsSchema = new mongoose.Schema({
  message: { type: String, maxlength: 140, minlength: 5, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Thoughts = mongoose.model("Thoughts", thoughtsSchema);

module.exports = Thoughts;
