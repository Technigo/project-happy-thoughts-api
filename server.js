import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: null
  },
  author: {
    type: String,
    default: null
  }
});

const Category = mongoose.model("Category", {
  _id: String
});

const Author = mongoose.model("Author", {
  _id: String
});

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the Happy Thoughts by M API!');
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find(req.query).sort({ createdAt: "desc" }).limit(20).exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message, author, category } = req.body;

  new Thought({ message, author, category }).save()
    .then((thought) => {
      res.status(200).json(thought);
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid input message", errors: err.errors });
    });
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const likedThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $inc: { hearts: 1 } },
      { new: true }
    );
    res.status(200).json(likedThought);
  } catch (err) {
    res.status(400).json({ message: "Invalid thoughtId" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    await Thought.aggregate([
      { $group: { _id: "$category" } },
      { $sort: { _id: 1 } },
      { $out: "categories" }
    ]);
    const categories = await Category.find().exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ err });
  };
});

app.get("/authors", async (req, res) => {
  try {
    await Thought.aggregate([
      { $group: { _id: "$author" } },
      { $sort: { _id: 1 } },
      { $out: "authors" }
    ]);
    const authors = await Author.find().exec();
    res.status(200).json(authors);
  } catch (err) {
    res.status(400).json({ err });
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
