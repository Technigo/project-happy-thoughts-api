import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts2";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message Required"],
    unique: true,
    trim: [true],
    minlength: [5, 'Must be a minimum of 5 characters.'],
    maxlength: [140, 'Must have a maximum of 140 characters!'],
  },
  hearts: {
    type: Number,
    default: 0, //should have this default value always
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", thoughtSchema);

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send(listEndpoints(app));
})

//Get all Thoughts
app.get("/thoughts", async (_, res)  => {
    const allThoughts= await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(allThoughts);
});

//Create a thought
app.post("/thoughts", async (req, res) => {
  try { 
    const newThought = await new Thought(req.body).save().limit(20)
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

//update likes to thought
app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      {
        _id: id,
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
