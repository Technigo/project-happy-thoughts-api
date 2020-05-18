import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Thought from "./models/thought";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const listEndpoints = require("express-list-endpoints");

//Tried to use consts instead of text in error handling.
const COULD_NOT_SAVE_THOUGHT = "Could not save thought to DB";
const COULD_NOT_FIND_THOUGHT_WITH_ID = "Could not find thought with ID:";
const COULD_FIND_THOUGHT = "Likes increased by one";

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
  const { page, sort } = req.query;

  //Same pagination as last week, I understand this one a lot better than the one I used for the first backend project.
  const pageNbr = +page || 1;
  const perPage = 20;
  const skip = perPage * (pageNbr - 1);

  const totalThoughts = await Thought.find();
  const pages = Math.ceil(totalThoughts.length / perPage);

  //Sets default sorting to newest first
  const sortTheThoughts = (sort) => {
    if (sort === "likes") {
      return {
        hearts: -1,
      };
    } else if (sort === "oldest") {
      return {
        createdAt: 1,
      };
    } else {
      return {
        createdAt: -1,
      };
    }
  };

  const thoughts = await Thought.find()
    .sort(sortTheThoughts(sort))
    .limit(perPage)
    .skip(skip)
    .exec();

  //Made an object that returns not only thoughts but current amount of pages to make pages feature easier in the frontend.
  res.json({ pages: pages, thoughts: thoughts });
});

//Not sure what to write here, this post will create and add a thought to the db ¯\_(ツ)_/¯
app.post("/thoughts", async (req, res) => {
  const { message, name, theme } = req.body;
  const thought = new Thought({
    message: message,
    name: name,
    theme: theme,
  });

  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res
      .status(400)
      .json({ message: COULD_NOT_SAVE_THOUGHT, error: err.errors });
  }
});

//I kept this a post because that whas the way Damien had done it in the API we used prior to our own. Maybe a put would be more appropriate but I'm sticking to this now.
app.post("/:thoughtID/like", async (req, res) => {
  const { thoughtID } = req.params;

  try {
    await Thought.updateOne({ _id: thoughtID }, { $inc: { hearts: 1 } });
    res.status(201).json({ message: COULD_FIND_THOUGHT });
  } catch (err) {
    res.status(404).json({
      message: `${COULD_NOT_FIND_THOUGHT_WITH_ID} ${thoughtID}`,
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
