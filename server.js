import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-happy-thoughts-api";
//this row below is a solution I saw someone else doing and hopefully it solves the error-
//messages regarding strictQuery that keeps showing up in the terminal
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

//The model for the thoughts - the "skeleton" that creates the structure of the data
const { Schema } = mongoose;
const ThoughtSchema = new Schema ({
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});
//The mongoose model can be seen as a wrapper around the Schema to perform specific operations
//on the database. This adds functionality to the Schema.
const Thought = mongoose.model("Thought", ThoughtSchema);

//Endpoint for returning a maximum of 20 thought - sorted by createdAt to show the
//most recent one first
app.get("/thoughts", async(req, res) => {
  try {
    const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
    res.status(200).json(thoughts);
  } catch(err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "An error occured, not possible to fetch thoughts"
    });
  }
});

//Posting a new thought to the API
app.post("/thoughts", async(req, res) => {
  const { message } = req.body;
  try {
    const newThought = await Thought({message}).save();
    res.status(200).json(newThought);
  } catch(err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "An error occured, not possible to create new thought"
    });
  }
});

//Update the likes for thoughts (hearts)
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updateHearts = await Thought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } }, { new: true });
    res.status(201).json(updateHearts);
  } catch(err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "An error occured, not possible to update hearts"
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
