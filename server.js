import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/HappyThoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Mongoose model
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    maxlength: 140,
    minlength: 5,
  },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

app.get("/thoughts", async (req, res) => {
  // Get all the thoughts
  const thoughts = await Thought.find({}).sort(
    { createdAt: "asc" }.limit(20).exec()
  );

  try {
    res.status(201).json(thoughts);
  } catch (err) {
    res.status(400).json({
      message: "Could not retrieve the Happy Thoughts.",
      error: err.errors,
    });
  }
});

app.post("/thoughts/", async (req, res) => {
  // Create a thought in the database
  const { message, heart } = req.body;
  const thought = new Thought({ message, heart });
  try {
    const newThought = await thought.save();
    res.status(201).json(newThought);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not save your thought.", error: err.errors });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  // Create like in the database
  const { thoughtId } = req.params;
  const thought = await Thought.findById(thoughtId);
  try {
    thought.hearts += 1;
    const updatedThought = await thought.save();
    res.status(201).json(updatedThought);
  } catch (err) {
    res.status(500).json({
      message: "Couldn't like the thought. Oh no!",
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
