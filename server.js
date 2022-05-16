import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Change this to routes later!");
});

app.get("/thoughts",  async (req, res) => {
  const addedThoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(addedThoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message, heart } = req.body;
  
  const newThought = new Thought({ message, heart });

  try {
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch(err) {
    res.status(400).json({message: 'Could not save to database', error: err.errors});
  }
})

// app.post("thoughts/:thoughtId/like", (req, res) => {

// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
