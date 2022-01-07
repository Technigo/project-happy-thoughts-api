import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";

mongoose.set("useFindAndModify", false);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new Schema({
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

// ROUTES
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new Thought({ message });

  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: "Could not save the thought",
      error: err,
    });
  }
});

app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedThought) {
      res
        .status(400)
        .json({ response: "Hearth not found. Opps!", success: false });
    } else {
      res.status(200).json({ response: updatedThought, success: true });
    }
  } catch (err) {
    res.status(400).json({ response: err, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
