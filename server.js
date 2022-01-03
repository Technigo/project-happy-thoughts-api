import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// const Thought = mongoose.model("Thought", {
//   message: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 140,
//     trim: true,
//   },
//   heart: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Number,
//     default: () => Date.now,
//   },
// });

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

mongoose.set("useFindAndModify", false);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});
// app.get("/thougths", async (req, res) => {});

app.post("/thougths", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/thougths/:thoughtsId/like", async (req, res) => {
  const { thoughtsId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtsId,
      {
        $inc: {
          heart: 1,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ response: updatedThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
