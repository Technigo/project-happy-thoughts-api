import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },

  heart: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//routes for all thoughts
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ creadtedAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

//route for posting thought
app.post("/thoughts", async (req, res) => {
  //Retrieve the info sent by the user to uor API ebdpoint
  const { message, heart } = req.body;

  //Using mongoose model to create the data entry
  const thought = new Thought({ message, heart });

  try {
    // success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: "Could not save thought to the Database",
      error: err.errors,
    });
  }
});

//route for adding likes to a post
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { heart: 1 } }, // Increment the hearts property by 1
      { new: true } // Return the updated thought
    );

    if (!thought) {
      // If the thought with the given ID is not found
      return res.status(404).json({ message: "Thought not found" });
    }

    res.json(thought);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
