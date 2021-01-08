import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const ERR_COULD_NOT_SAVE_TO_DB = "Could not save thought to the database";
const ERR_SERVICE_UNAVAILABLE = "Service unavailable";
const ERR_NO_ENDPOINTS_FOUND = "No endpoints found. Try again later";
const ERR_COULD_NOT_SAVE_LIKE = "Could not save like for id:";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = new mongoose.model("Thought", {
  message: {
    type: String,
    required: [true, "Message is required"],
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

// if (process.env.RESET_DATABASE) {
//   const seedDatabase = async () => {
//     await Thought.deleteMany();
//   };
//   seedDatabase();
// } // Added this block of code in case database requires updating during maintenance

const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: ERR_SERVICE_UNAVAILABLE });
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
  // const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
  // res.json(thoughts);

  const sortField = req.query.sortField; // These x2 query parameters allow the client to sort data from
  const sortOrder = req.query.sortOrder || "desc";
  const limit = req.query.limit || 20;

  // console.log(`GET /thoughts?sortField=${sortField}&sortOrder=${sortOrder}`);

  let databaseQuery = Thought.find(); // Creates the initial query

  if (sortField) {
    // If we have extra information we can modify the query before we execute it
    databaseQuery = databaseQuery.sort({
      [sortField]: sortOrder === "desc" ? -1 : 1,
    });
  }

  if (limit) {
    databaseQuery = databaseQuery.limit(+limit); // Limits the results - 20 default
  }

  // Database query modifications before you actually excecute the database query
  const results = await databaseQuery;
  res.status(200).json(results);
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
