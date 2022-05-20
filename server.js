import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

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
    default: () => new Date(),
  },
});

const thought = mongoose.model("thought", ThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//Get thoughts, answer is limited to 20 results, ordered by time in descending order.
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await thought
      .find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
});

// Send a new thought.
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new thought({ message: message }).save();
    res.status(201).json({
      response: newThought,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    });
  }
});

//Add likes to a message
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thoughtToLike = await thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1 },
    });
    res.status(200).json({
      response: `This message ${thoughtToLike.message} has new likes`,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
