import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//Get the 20 latest thoughts route, desc = newest first
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

// Post/add new thought
app.post("/thoughts", async (req, res) => {
  // Retrive the information sent by the client to our API endpoint
  const { message } = req.body;
  // Then use our mongoose model to create the database entry
  const thought = new Thought({ message });

  try {
    // Success-case, send good status code to the client
    const savedThought = await thought.save({ message });
    res.status(200).json(savedThought);
  } catch (err) {
    // Bad-req, send bad status code to the client
    res.status(404).json({
      message: "Sorry, could not save this thought to database.",
      errors: err.errors,
    });
  }
});

// Post hearts to a specific message
app.post("/:id/like", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      //increment by 1
      { $inc: { hearts: 1 } }
    );
    res.json(thought).status(200);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Sorry, could not find thought", error: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
