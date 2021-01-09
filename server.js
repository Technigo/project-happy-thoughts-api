import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = new mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  username: {
    type: String,
    maxlength: 100,
    default: "Anonymous",
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

const ERR_COULD_NOT_SAVE_TO_DB = "Could not save thought to the database";
const ERR_SERVICE_UNAVAILABLE = "Service unavailable";
const ERR_NO_ENDPOINTS_FOUND = "No endpoints found";
const ERR_NO_RESULTS_FOUND = "No results found";
const ERR_COULD_NOT_SAVE_LIKE = "Could not save like for id:";

const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).send({ error: ERR_SERVICE_UNAVAILABLE });
  }
});

// Returns a list of available endpoints
app.get("/", (req, res) => {
  if (res) {
    res.status(200).send(listEndpoints(app));
  } else {
    res.status(404).json({ error: ERR_NO_ENDPOINTS_FOUND });
  }
});

app.get("/thoughts", async (req, res) => {
  const sort = req.query.sort;
  const pageSize = 20;

  //Sets default sorting to newest first
  const sortThoughts = sort => {
    if (sort === "hearts") {
      return { hearts: -1 };
    } else if (sort === "oldest") {
      return { createdAt: 1 };
    } else {
      return { createdAt: -1 };
    }
  };

  const thoughts = await Thought.find()
    .sort(sortThoughts(sort))
    .limit(pageSize)
    .exec();

  if (thoughts) {
    res.status(200).json(thoughts);
  } else {
    res.status(400).send({ message: ERR_NO_RESULTS_FOUND, error: err.errors });
  }
});

app.post("/thoughts", async (req, res) => {
  const message = req.body.message;
  const username = req.body.username;
  const thought = new Thought({ message, username });

  try {
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: ERR_COULD_NOT_SAVE_TO_DB,
      error: err.errors,
    });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    res.status(201).json({ success: true, thoughtId });
  } catch (err) {
    res.status(400).json({
      message: `${ERR_COULD_NOT_SAVE_LIKE} ${thoughtId}`,
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
