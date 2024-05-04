import express from "express";
import cors from "cors";
import mongoose, { model } from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
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
    minlength: 5,
    maxlength: 140,
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
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
    res.send(thoughts);
  })
  .post(async (req, res) => {
    try {
      const newThought = await new Thought({
        message: req.body.message,
      }).save();
      res.status(200).send(newThought);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Post request failed", error: err.errors });
    }
  });

app.route("/thoughts/:thoughtId/like").post(async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { returnDocument: "after" }
    );
    console.log(req.params.thoughtId);
    res.status(200).json(thought);
  } catch (err) {
    res.status(400).json({ message: "Post request failed", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
