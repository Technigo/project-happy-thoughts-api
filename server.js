import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/HappyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Thought model
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

// Routes
app.get('/', (req, res) => {
  const endpoints = [
    { path: "/", methods: ["GET"], middlewares: ["anonymous"] },
    { path: "/thoughts", methods: ["GET", "POST"], middlewares: ["anonymous"] },
    { path: "/thoughts/:thoughtId/like", methods: ["POST"], middlewares: ["anonymous"] }
  ];
  res.json({ endpoints });
});

// GET /thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20);
  res.json(thoughts);
});

// POST /thoughts
app.post('/thoughts', async (req, res) => {
  // Only allow the message field from the request to prevent setting hearts
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ message: 'Could not save thought to the database', error: error.errors });
  }
});

// POST thoughts/:thoughtId/like
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    // Find the thought by id and increment hearts by 1
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

