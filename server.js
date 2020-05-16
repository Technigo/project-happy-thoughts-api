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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
/*app.get("/", (req, res) => {
  res.send("Hello World");
});*/

const listEndpoints = require("express-list-endpoints");
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//Get the 20 latest thoughts route
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  // Retrieve the information sent by client to our API endpoint
  const { message } = req.body;

  // Use our mongoose model to create the database entry
  const thought = new Thought({ message });

  try {
    // Succes
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Sorry, could not post this", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
