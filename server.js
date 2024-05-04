import express from "express";
import cors from "cors";
import mongoose, { model } from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Thought model
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// Start defining your routes here
app.route("/").get(async (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

//
app
  .route("/thoughts")
  .get(async (req, res) => {
    const thoughts = await Thought.find();
    res.send(thoughts);
  })
  .post(async (req, res) => {
    const newThought = await new Thought(req.body);
    try {
      res.send(newThought);
    } catch (error) {
      res.status(404).json("Didn't work...");
    }
  });

app.route("thoughts/:thoughtId/like").post();

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
