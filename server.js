import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://0.0.0.0/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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

const port = process.env.PORT || 8080;
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Middleware to check so MongoDB connection is OK
app.use((res, req, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// GET - All 'thoughts'
app.get("/api/thoughts", async (req, res) => {
  console.log("get end point is called");
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    return res.json(thoughts).status(200);
  } catch (err) {
    res.status(400).json({ message: "Error. Could not get thoughts" });
  }
});

// POST - Create a 'thought'
app.post("/api/thought", async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new Thought({ message }).save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ message: "Unable to save", error: err.errors });
  }
});

// POST - Like a 'thought'
app.post("/api/thought/:thoughtId/like", async (req, res) => {
  try {
    const like = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $inc: { hearts: 1 } },
      { returnNewDocument: true }
    );
    res.json(like).status(201);
  } catch (err) {
    res.status(400).json({ message: "Could not save like", error: err });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});
