import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

// Load environment variables
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// PORT=8080 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable." });
  }
});

//Models
const Thought = mongoose.model("Thought", {
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

//Here the routes GET and POST
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const documentation = {
    Welcome: "This is the Happy Thoughts API!",
    Endpoints: {
      "/": "Get API documentation",
      "/thoughts": "Get 20 latest thoughts",
      "/thoughts/:thoughtId/like": "Like a specific thought",
    },
  };
  res.json(documentation);
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/thoughts", async (req, res) => {
  try {
    const thought = new Thought({ message: req.body.message });
    await thought.save();
    res.status(201).json({
      success: true,
      response: thought,
      message: "Thought posted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not save thought.",
    });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
