import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());


//Mongoose schema
const ThoughtSchema = new mongoose.Schema({
  message: {
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
})

const Thought = mongoose.model("Thought", ThoughtSchema)

//Routes
app.get("/", (req, res) => {
  res.send({ 
    "Hello Happy Thoughts! https://cute-hummingbird-6688bb.netlify.app/":
    listEndpoints(app)
  })
})

//show thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

//add thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({message: message}).save()
    res.status(201).json({response: newThought, success: true})
  } catch(error) {
    res.status(400).json({response: error, success: false})
  }
})

//add likes
app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params
  try {
    const updateLikes = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}})
    res. status(200).json(updateLikes)
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
