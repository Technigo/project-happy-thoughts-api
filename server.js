import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import { Thought } from "./models/Thought";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Thought.deleteMany({});

//     db.myCollection.happyThoughts.thoughts.forEach(thought => {
//       new Thought(thought).save();
//     });
//   };

//   seedDatabase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// new Thought({ message: "He" }).save();

// Start defining your routes here
app.get("/", async (req, res) => {
  Thought.find((err, thoughts) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Not found" });
    } else {
      res.json(thoughts);
    }
  })
    .sort({ createdAt: -1 })
    .limit(20);
});

app.post("/", async (req, res) => {
  try {
    const thought = new Thought({ message: req.body.message });
    await thought.save();
    res.json(thought);
  } catch (err) {
    res
      .status(400)
      .json({ errors: err.errors, message: "Cannot add new thought" });
  }
});

app.post("/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const like = await Thought.findOne({ _id: thoughtId });
  // const heart = new Thought({ heart: req.body.heart + 1 });

  console.log(thoughtId);

  if (like) {
    res.json(like);
  } else {
    res.status(404).json({ error: "No thought - so no like" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
