import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;
const Thought = mongoose.model("Thought", {
  // this is the schema that tells the data base what kind of data we are expecting. like year-film, category and so on.
  message: String,
  hearts: Number,
  // createat is a timestamp that will be added automatically, it tells me when the thought was created.
  createdAt: {
    type: Date,
    default: Date.now,
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).exec();
  res.json(thoughts);
});

app.post("/thoughts", (req, res) => {
  const newThought = new Thought({ message: req.body.message, hearts: 0 });
  newThought.save().then(() => {
    res.json(newThought);
  });
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const thought = await Thought.findById(thoughtId);
  thought.hearts += 1;
  thought.save().then(() => {
    res.json(thought);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
