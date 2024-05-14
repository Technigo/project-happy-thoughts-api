import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import Thought from "./models/Thought";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
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

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Get all thoughts
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  res.json(thoughts);
});

// Post a thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Could not save the thought...",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
