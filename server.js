import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required!"],
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
  const { page = 0 } = req.query;

  try {
    const thoughts = await Thought.find()
      .skip(page * 15)
      .limit(15)
      .sort({ createdAt: -1 });
    res.json(thoughts);
  } catch (error) {
    res.status(400).json({ message: "Failed to load thoughts" });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const thought = await new Thought({ message }).save();
    res.json(thought);
  } catch (error) {
    res.status(400).json({ message: "Couldn't save message" });
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, {
      $inc: { hearts: 1 },
    });
    res.json(updatedThought);
  } catch (error) {
    res.status(404).json({ message: "Couldn't find thought by id" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
