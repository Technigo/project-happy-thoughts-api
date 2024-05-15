import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/technigo-w15-project-happy-thoughts-mongo";
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

const { Schema, model } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
});

const Thought = model("Thought", thoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const createdAt = new Date();

  try {
    const thought = await new Thought({ message, createdAt }).save();
    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Thought couldn't be created",
    });
  }
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().limit(20).sort({ createdAt: -1 });
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Couldn't get the thoughts",
    });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } }, { new: true });
    res.status(201).json(likedThought);
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "You were unable to like the thought",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
