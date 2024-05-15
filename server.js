import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints"
import { Thought } from "./models/Thought"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-thoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

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
  res.send("Hello Technigo!");
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({createdAt: "desc"}).limit(20).exec()
  res.status(404).json(thoughts);
  } catch(err){
    res.status(404).json({message: "No happy thoughts", error: err.errors})
  }
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new Thought({ message });

  try {
    const addedThought = await thought.save()
    res.status(201).json(addedThought)
  } catch(err) {
    res.status(404).json({message: "Could not add thought", error: err.errors})
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  
  const { thoughtId } = req.params

  
  try {
    const incrementLike = await Thought.findByIdAndUpdate(thoughtId, {$inc: { hearts: 1} }, {new: true})
    res.status(201).json(incrementLike)
  } catch(err) {
    res.status(404).json({message: "Could not add like", error: err.errors})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
