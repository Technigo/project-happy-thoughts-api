const mongoose = require("mongoose");

const thoughtsSchema = new mongoose.Schema({
  message: { type: String, maxlength: 140, minlength: 5, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Number, default: new Date() },
});
const Thoughts = mongoose.model("Thoughts", thoughtsSchema);

module.exports = Thoughts;
