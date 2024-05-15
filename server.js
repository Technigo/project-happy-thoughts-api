import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

//establish connection to MongoDB database using Mongoose
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

//define thought model
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
    default: Date.now,
  },
});

//adding a new thought to test thought model
// new Thought({ message: "Happy to be starting with this API 😍" }).save();

//defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

//add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

//endpoint to get 20 thoughts sorted by createdAt (GET/thoughts)
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

//endpoint to post thoughts (POST/thoughts)
app.post("/thoughts", async (req, res) => {
  //retrieve information sent to API endpoint
  const { message } = req.body;
  //use mongoose model to create the database entry
  const thought = new Thought({ message });

  try {
    //success case
    const newThought = await thought.save();
    res.status(201).json(newThought);
  } catch (err) {
    //bad request
    res.status(400).json({
      message:
        "Sorry, your thought was not saved. Make sure your message is between 5 to 140 characters.",
      error: err.errors,
    });
  }
});

//endpoint to add ❤️ to the thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updateThought = await Thought.findById(thoughtId);

    if (!updateThought) {
      return res.status(404).json({ error: "Thought could not be found." });
    }

    //increments the hearts property of the thought by 1
    updateThought.hearts++;
    //saves updated thought back to database
    await updateThought.save();
    //success case
    res.json({ message: "❤️ added successfully", updateThought });
  } catch (err) {
    //bad request
    res.status(400).json({
      message: "Sorry, could not ❤️ your thought",
      error: err.errors,
    });
  }
});

//add API to old happy thoughts project

//update readme and open pull request

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
