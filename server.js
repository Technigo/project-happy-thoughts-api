import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;
const Thought = mongoose.model("Thought", {
  // this is the schema that tells the data base what kind of data we are expecting. like year-film, category and so on.
  message: {
    type: String,
    required: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
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

// here is where the routes are defined.(thoughts)
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    // sort by createdAt in descending order, so i get the newest thoughts first
    .sort({ createdAt: "desc" })
    // limited to 20 thoughts
    .limit(20)
    .exec();
  res.status(200).json(thoughts);
});
// this is a post request that will create a new thought, raw data is sent in the body of the request.
app.post("/thoughts", (req, res) => {
  if (req.body.message.length < 5 || req.body.message.length > 140) {
    res.status(400).json({
      message: "Message must be between 5 and 140 characters",
    });
    return;
  }
  // create a new thought and save it to the database, mongo db will create a unique id for the thought.
  const newThought = new Thought({ message: req.body.message, hearts: 0 });
  newThought.save().then(() => {
    res.status(201).json(newThought);
  });
});
// here we create the hearts, the likes
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const thought = await Thought.findById(thoughtId);
  if (!thought) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  // add a heart to the thought
  thought.$inc({ hearts: 1 });
  // here is where the heart is saved to the database
  thought.save().then(() => {
    res.status(200).json(thought);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
