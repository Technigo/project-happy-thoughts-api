import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    min: 5,
    max: 140,
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/thoughts", async (req, res) => {
  try {
    const fetchThoughts = await Thought.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(fetchThoughts);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/thoughts", async (req, res) => {
  if (req.body.hearts !== undefined || req.body.createdAt !== undefined) {
    res.status(400).send("Bad request");
  } else {
    const postThoughts = new Thought(req.body);
    await postThoughts.save();
    res.status(201).send(postThoughts);
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const postId = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(postId);
  if (isValidId === true) {
    const foundPost = await Thought.findOne({ _id: postId }).exec();

    if (foundPost !== null) {
      foundPost.hearts = foundPost.hearts + 1;
      await foundPost.save();
      res.status(200).send(foundPost);
    } else {
      res.status(404).send("Not Found");
    }
  } else {
    res.status(404).send("Not Found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
