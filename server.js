import express from "express";
import cors from "cors";
import mongoose, { model } from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
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

// Thought model
const Thought = model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Start defining your routes here
app.route("/").get(async (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

// Get all thoughts
app
  .route("/thoughts")
  .get(async (req, res) => {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
    res.send(thoughts);
  })
  .post(async (req, res) => {
    try {
      const newThought = await new Thought({
        message: req.body.message,
      }).save();
      res.status(201).send(newThought);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Post request failed", error: err.errors });
    }
  });

// Get or delete specific thought
app
  .route("/thoughts/:thoughtId")
  .get(async (req, res) => {
    console.log("test", req.params.thoughtId);
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      res.status(201).json(thought);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Could not find thought", error: err.errors });
    }
  })
  .delete(async (req, res) => {
    try {
      await Thought.findByIdAndDelete(req.params.thoughtId);
      res.status(201).send(`Deleted thougth ${req.params.thoughtId}`);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Could not delete thought", error: err.errors });
    }
  });

// Like specific thought
app.route("/thoughts/:thoughtId/like").post(async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { returnDocument: "after" }
    );
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ message: "Post request failed", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
