import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

mongoose.set('strictQuery', false);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const thoughtSchema = new mongoose.Schema({
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
    default: Date.now,
  },
});

const Thought = mongoose.model('Thought', thoughtSchema);

// New route to display available routes
app.get("/", (req, res) => {
  const routes = app._router.stack
    .filter((r) => r.route)
    .map((r) => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods),
      middleware: r.route.stack.map((m) => m.name),
    }));
  res.json(routes);
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = new Thought({ message });
    const savedThought = await newThought.save();

    res.json(savedThought);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    thought.hearts += 1;
    const updatedThought = await thought.save();

    res.json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
