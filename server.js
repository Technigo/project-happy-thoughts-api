import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

//only connected to local database 
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
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

// Creating Schema
const ThoughtsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, 
    minlength: 5,
    maxlength: 140, 
    trim: true 
  }, 
  hearts: {
    type: Number, 
    default: 0
  }, 
  createdAt: {
    type: Date, 
    default: () => new Date()
  }
});

// Creating model 
const Thought = mongoose.model("Thought", ThoughtsSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Hello Happy Thoughts API!");
});

//Creates a new thought
app.post("/thoughts", async (req, res) => {
  const {text, createdAt} = req.body;
  try {
    const newThought = await new Thought({text: text, createdAt: createdAt}).save();
    res.status(201).json({success: true, response: newThought});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

// Gets the last 20 thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({createdAt: "desc"}).limit(20).exec();
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

// Updates the heart counter on one thought (and returns the updated thought)
app.patch("/thoughts/:id/hearts", async (req, res) => {
  const { id } = req.params;
  try {
    const thoughtsToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}}, {new: true});
    res.status(200).json({success: true, response: thoughtsToUpdate})
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

// Gets a thought by _id
app.get("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  const thoughtById = await Thought.findById(id);
  res.status(200).json(thoughtById)
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
