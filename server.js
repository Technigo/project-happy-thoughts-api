import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// mongodb://localhost/happyThoughts
const mongoUrl = process.env.MONGO_URL || "MONGO_URL";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// scheema : name. description etc
// This way, when you are going to reuse your schema
// Enum = only allowed values
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
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
//Mongoose model with Schema
const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json({
    message:
      "View all thoughts at http://happy-thoughts-patrik.herokuapp.com/thoughts",
  });
});

//Endpoint that return thoughts in descending order
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Post method for adding likes/hearts
app.post("/thoughts/:id/hearts", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: { hearts: 1 },
      },
      { new: true }
    );
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Delete Thought by Id
app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json(deletedThought);
    } else {
      res.status(404).json({ response: "Thought not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Patch thought message
app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ response: "Thought not found", success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
