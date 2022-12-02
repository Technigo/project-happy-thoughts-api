import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// creating the schema, the structur of our model
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 140,
    trim: true,
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const Thoughts = mongoose.model("Thoughts", ThoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    "Welcome": "Happy Thoughts API",
    "Routes": [
      {
        "/thoughts": "All happy thoughts"
      }
    ]
  });
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thoughts.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thoughts({
      message: message
    }).save();
    res.status(201).json({ sucess: true, resonse: newThought });
  } catch (error) {
    res.status(400).json({ success: false, response: error });
  }
});
app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const heartToUpdate = await Thoughts.findByIdAndUpdate(id, {
      $inc: { heart: 1 },
    });
    res
      .status(200)
      .json({
        success: true,
        response: `Thought ${heartToUpdate.message} has it's heart updated`,
      });
  } catch (error) {
    res.status(400).json({ success: false, response: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
