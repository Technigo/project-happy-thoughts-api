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

const ThoughtSchema = new mongoose.Schema({
  user: {
    type: String,
    default: "Anonymous",
    minlength: 2,
    maxlength: 25,
  },
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

const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      error: "Connection problems",
    });
  }
});

// Start defining your routes here
app.get("/thoughts", async (req, res) => {
  const {
    page,
    perPage,
    pageNum = Number(page),
    perPageNum = Number(perPage),
  } = req.query;

  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .skip((pageNum - 1) * perPageNum)
    .limit(perPageNum);
  res.status(200).json({
    message: thoughts,
    success: true,
  });
});

app.post("/thoughts", async (req, res) => {
  const { message, user } = req.body;

  try {
    const savedThought = await new Thought({
      message,
      user,
    }).save();
    res.status(201).json({
      message: savedThought,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    if (likedThought) {
      res.status(200).json({
        message: likedThought,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Couldn't find post",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error,
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
