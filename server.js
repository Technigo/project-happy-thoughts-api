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
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
    trim: true,
    // enum: ["Food", "Love", "Friends"],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    "Hello world, welcome to this happy thoughts api made by Amanda Tilly. See it in action here: https://happythoughts-amandatilly.netlify.app/"
  );
});

app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20);
    res.status(200).json(allThoughts);
  } catch (error) {
    res.status(404).json({
      message: "Can not find thoughts",
      errors: error.errors,
      success: false,
    });
  }
});

// post request for creating new documents
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({
      message: "Can not post message",
      response: error,
      success: false,
    });
  }
});

// patch request to update document
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedHeart = await Thought.findByIdAndUpdate(
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
    res.status(200).json({ response: updatedHeart, success: true });
  } catch (error) {
    res.status(400).json({
      message: "Can not like thought",
      response: error,
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
