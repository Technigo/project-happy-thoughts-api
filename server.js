// Requirements
// Your API should implement the routes exactly as documented in the instructions above
// Your GET /thoughts endpoint should only return 20 results, ordered by createdAt in descending order.
// Your API should validate user input and return appropriate errors if the input is invalid.
// In the POST /thoughts endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to 400 (bad request).
// The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//------The Thought model------//
// message is required, min length 5 chars, max length 140 chars
//hearts defaults to 0, should not be assignable when creating a new thought
// For example, if I send a POST request to / to create a new thought with this JSON body; { "message": "Hello", "hearts": 9000 }, then the hearts property should be ignored, and the object we store in mongo should have 0 hearts.
//createdAt defaults to current time, not assignable when creating a new thought

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

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//-----Routes------//

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//----- GET/thoughts ------//
// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
  if (thoughts) {
    res.status(201).json(thoughts);
  } else {
    res.status(404).json({ error: `No thoughts found` });
  }
});

//----- POST/thoughts ------//

app.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body;
    const thought = new Thought({ message });
    await thought.save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ message: "Could not be saved", errors: err.errors });
  }
});

//----- POST/thoughts/:thoughtId/like ------//

app.get("/thoughts/:_id", async (req, res) => {
  const tId = req.params._id;
  const foundThought = await Thought.findById(tId);
  if (foundThought) {
    res.status(201).json({ body: foundThought });
  } else {
    res.status(404).json({ error: `No thought matching that id found` });
  }
});

app.post("/thoughts/:_id/like", async (req, res) => {
  const tId = req.params._id;
  const addLike = await Thought.findByIdAndUpdate(
    tId,
    {
      $inc: { hearts: 1 },
    },
    { new: true }
  );
  res.status(201).json(addLike);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
