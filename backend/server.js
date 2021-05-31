import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughtAPI";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = Promise;

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required!"],
    unique: true,
    trim: true,
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

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts");
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Duplicated value", fields: error.keyValue });
    }
    res.status(400).json(error);
  }
});

app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: {
          hearts: 5,
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

app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.deleteOne({ _id: id });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

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
    res.status(400).json({ message: "Invalid request", error });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
