import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message: String,
  hearts: Number,
  createdAt: Date,
});

// must be "function" to preserve "this"
ThoughtSchema.methods.like = async function likeThought() {
  this.hearts++;
  await this.save();
};

const Thought = mongoose.model("Thought", ThoughtSchema);

// Thought.deleteMany({}).then(() => console.log("deleted"));

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello thoughts!");
});

// /thoughts?page=2&limit=20?sort=hearts
app.get("/thoughts", async (req, res) => {
  const thoughtsQuery = Thought.find();

  // sort field, note that it can be only one of two (or empty)
  const sortField = req.query.sort || "createdAt";
  if (sortField !== "hearts" && sortField !== "createdAt") {
    return res.status(400).send('sort field can be only "date" or "hearts"');
  }

  // We need to access the page and limit set by the client.
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  // Pagination
  const startPage = (page - 1) * limit;

  // note, that we need to sort in reverse order
  const thoughts = await thoughtsQuery.sort(`-${sortField}`).skip(startPage).limit(limit);

  // note: we never answer "404"
  // but rather empty array showing that there are no thoughts for given filters
  res.send(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const message = req.body.message;

  // import validation
  if (!message || typeof message !== "string") {
    return res.status(400).send("Incorrect request. Body must be JSON and contain field 'message' with string");
  }

  if (message.length < 5) {
    return res.status(400).send("Message must be at lest 5 characters long");
  }

  if (message.length > 140) {
    return res.status(400).send("Message cannot be longer 140 characters");
  }

  const thought = new Thought({
    message,
    hearts: 0,
    createdAt: new Date(),
  });

  await thought.save();
  res.status(200).json(thought);
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;

  const thought = await Thought.findById(thoughtId);

  if (!thought) {
    res.status(404).send(`No though with id ${thoughtId}`);
    return;
  }

  await thought.like();
  res.status(200).json(thought);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
