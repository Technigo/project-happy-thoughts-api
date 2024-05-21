import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

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
    default: Date.now,
  },
});

app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const info = endpoints.map((endpoint) => ({
    path: endpoint.path,
    methods: endpoint.methods.join(", "),
  }));
  res.json(info);
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  if (thoughts.length > 0) {
    res.json(thoughts);
  } else {
    res.status(404).send("Sorry, no thoughts were found...");
  }
});

app.post("/thoughts", (req, res) => {
  if (req.body.message.length < 5 || req.body.message.length > 140) {
    res.status(400).json({
      message: "Thoughts must be between 5 and 140 characters",
    });
    return;
  }

  const newThought = new Thought({ message: req.body.message, hearts: 0 });
  newThought.save().then(() => {
    res.json(newThought);
  });
});

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Not found" });
    }

    thought.hearts += 1;
    const updateThought = await thought.save();

    return res.status(200).json(updateThought);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Sorry, this thought was not found", err: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
