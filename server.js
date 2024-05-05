import express from "express";
import cors from "cors";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1/project-happry-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    require: true,
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
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const documentation = endpoints.map((endpoint) => ({
    method: endpoint.methods.join(", "),
    path: endpoint.path,
  }));
  res.json(documentation);
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();

  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message, createdAt } = req.body;
  const thought = new Thought({ message, createdAt });

  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Could not send thought", errors: err.errors });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    thought.hearts++;
    await thought.save();

    res.json({ message: "Like added successfully", thought });
  } catch (err) {
    res.status(500).json({ message: "Could not add like", error: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
