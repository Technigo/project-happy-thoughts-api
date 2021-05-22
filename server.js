import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "The message field is mandatory"],
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value);
      },
      message: "Numbers are not allowed",
    },
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

const Thought = mongoose.model("Thought", thoughtSchema);

app.use(cors());
app.use(express.json());

// All my endpoints

app.get("/", (req, res) => {
  res.send("❤ Welcome to Happy Thoughts app ❤. Use GET /thoughts to get the existing thoughts.");
});

//endpoint to get existing thoughts, sorted by the time they were created with the most recent being presented first, and limited to 20.

app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  res.json(allThoughts);
});

//endpoint to post new thoughts

app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ error: "Duplicated value", fields: error.keyValue });
    }
    res.status(400).json(error);
  }
});

//endpoint to post likes to existing thoughts

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {
        _id: thoughtId,
      },
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

//endpoint to delete an existing endpoint

app.delete("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete({ _id: thoughtId });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

//endpoint to update an existing thought

app.patch("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      req.body,
      { new: true }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
});

// Start the server
app.listen(port, () => {});
