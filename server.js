import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Thought from "./models/thoughts";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  // Retreve the information sent by the client to our API endpoint
  const { message } = req.body;

  // Use our mongoose model to create the database entry
  const thought = new Thought({ message });

  try {
    // Success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({
      messege: "Could not post",
      error: err.errors,
    });
  }
});

app.post("/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  // find thought with by id and increment likes by 1
  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { likes: 1 } },
      { useFindAndModify: false, new: true }
    );
    res.status(200).json({
      message: `You liked a thought`,
      thought,
    });
  } catch (err) {
    res.status(400).json({
      message: "Could not like thought",
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
