import express from "express";
import cors from "cors";
import mongoose, { get } from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

//schema - validators and error messages, default values
const thoughtSchema = mongoose.Schema({
  message: {
    type: String,
    required: [true, "Ops, you forgot to write a message."],
    minlength: [
      5,
      "Try again, the messages needs to be at least five characters.",
    ],
    maxlength: [
      140,
      "Try again, the messages needs to be less than 140 characters.",
    ],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // can be written like () => Date.now()
  },
});

//model
const Thought = mongoose.model("Thought", thoughtSchema);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// GET request - show thoughts, sort latest post on top, limit to 20 messages
app.get('/thoughts', async (req,res) => {
  const allThoughts = await Thought.find().sort( { createdAt: -1 } ).limit(20)
  res.json(allThoughts)
})

// POST request - save new thought to db - add message: req.body again (not to manipulat hearts or date)
app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    res.status(400).json(error);
  }
});

// POST request - update hearts to the db
app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedThought = await Thought.findOneAndUpdate( {_id: id}, { $inc: { hearts: 1 }}, { new: true});
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

// DELETE request - delete thought from db
app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

// Change in the frontend where we use POST for increasing hearts...
// PATCH request - updates entity
app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, req.body, { new: true, });
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalied requeset", error });
  }
});

// PUT request - replace entity
app.put("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedThought = await Thought.findOneAndReplace(
      { _id: id },
      req.body,
      { new: true }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalied requeset", error });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
