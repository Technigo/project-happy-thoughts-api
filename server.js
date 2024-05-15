import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and model definition
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

const Thought = mongoose.model("Thought", thoughtSchema);

// Express app setup
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.json(thoughts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve thoughts", details: err.message });
  }
});

app.post("/thoughts", async (req, res) => {
   console.log("Received data:", req.body); 
    const { message } = req.body;
    const thought = new Thought({ message });
    try {
      const savedThought = await thought.save();
      res.status(201).json(savedThought);
    } catch (err) {
      res.status(400).json({
        error: "Could not save your happy thought",
        details: err.message,
      });
    }
});

app.get("/thoughts/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (thought) {
      res.status(200).json(thought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching thought", details: err.message });
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (updatedThought) {
      res.status(201).json(updatedThought);
    } else {
      res.status(404).json({ error: "Thought not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Could not increment hearts", details: err.message });
  }
});

// Server start with graceful shutdown
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
