import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = Promise;
mongoose.set("debug", { shell: true });

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
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

const port = process.env.PORT || 8081;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/uptime", (req, res) => {
  res.status(200).json({
    state: "up",
    dbState: mongoose.STATES[mongoose.connection.readyState],
  });
});

app.get("/", (req, res) => {
  res.send("Hello from the other side 🎶");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  try {
    const { message, name } = req.body;
    const thought = await new Thought({ message, name }).save();
    res.status(200).json(thought);
  } catch (err) {
    res.status(400).json({ message: "Could not save", errors: err });
  }
});

app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: id },
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404({ message: "Not found!" }));
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: "Not found!" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

app.listen(port, () => {
  console.log(`WOOOP 🚀 Server running on http://localhost:${port}`);
});
