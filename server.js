import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-api";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Model
const Thought = mongoose.model("Thought", {
  text: {
    type: String,
    required: true,
    minLength: 5,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const port = process.env.PORT || 8081;
const app = express();

app.use(cors());
app.use(express.json());

// GET /thoughts endpoint to return 20 results ordered by createdAt in descending order
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /thoughts endpoint to create a new thought
app.post("/thoughts", async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 5 || text.length > 140) {
    return res
      .status(400)
      .json({ error: "Text must be between 5 and 140 characters long" });
  }
  try {
    const thought = new Thought({ text });
    await thought.save();
    res.status(201).json(thought);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to add hearts to a thought
app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const thought = await Thought.findById(id);
    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }
    thought.hearts += 1;
    await thought.save();
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Default endpoint to list all registered endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
