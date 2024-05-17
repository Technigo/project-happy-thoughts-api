import cors from "cors";
import express from "express";
import { MongoCryptCreateDataKeyError } from "mongodb";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happythoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Model
const { Schema, model } = mongoose;
const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hearts: {
    type: Number,
    default: 0,
  },
});

const Thought = model("Thought", thoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Happy thoughts!");
});

//Get all thoughts
app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();

  if (allThoughts.length > 0) {
    res.json(allThoughts);
  } else {
    res.status(404).send("No thoughts was found");
  }
});

//Post new though
app.post("/thoughts", async (req, res) => {
  const { message, createdAt, hearts } = req.body;

  try {
    const thought = await new Thought({
      message,
      createdAt,
      hearts,
    }).save();

    res.status(201).json({
      success: true,
      response: thought,
      responsemessage: "Thought created and saved",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      responsemessage: "Couldn't save new thought",
    });
  }
});

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  const { hearts } = req.body; //Remove this?

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } }, // Increment the hearts count by 1
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({
        success: false,
        responsemessage: "Thought not found",
      });
    }

    res.status(200).json({
      success: true,
      response: thought,
      responsemessage: "Heart incremented successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      responsemessage: "Couldn't increment heart",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
