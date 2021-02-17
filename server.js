import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
  name: {
    type: String,
    default: "Anonymous"
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
})

const port = process.env.PORT || 2500
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here

const myEndpoints = require("express-list-endpoints")
app.get("/", (req, res) => {
  res.send(myEndpoints(app))
})

//Handling erorrs by summing them in consts
const COULD_NOT_SAVE_THOUGHT = 4
const COULD_NOT_FIND_THOUGHT_WITH_ID = "Sorry! Unable to find the thought with the ID: ";
const COULD_FIND_THOUGHT = "Added one more like";

//GET THOUGHTS
app.get("/thoughts", async (req, res) => {
  const { page, sort } = req.query;

  //Pagination to display 20 thoughts per page and go onto skip page once the count is fullfilled
  const pageNo = +page || 1;
  const thoughtsPerPage = 20;
  const skip = thoughtsPerPage * (pageNo - 1);

  const allThoughts = await Thought.find();
  const pages = Math.ceil(allThoughts.length / thoughtsPerPage);

  //Sort thoughts by the ones created most recently / returns the amount of thoughts and pages
  const sortAllThoughts = (sort) => {
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
    .sort(sortAllThoughts(sort))
    .limit(thoughtsPerPage)
    .skip(skip)
    .exec();

  res.json({ pages: pages, thoughts: thoughts });
});

//POST THOUGHTS
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
  console.log(`Server running on http://localhost:${port}`)
})
