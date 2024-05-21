import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from 'express-list-endpoints'
import dotenv from "dotenv"

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Thoughts = mongoose.model("Thoughts",{
  message: {
    type: String,
    minLength: 5,
    maxLength: 140,
    required: true
  },
  hearts:{
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

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
  const endpoints = expressListEndpoints(app);
  res.json(endpoints)
});

app.get("/thoughts", async (req, res) => {
  try{
    const thoughts = await Thoughts.find().sort({createdAt: -1}).limit(20).exec()
    res.json(thoughts)
    } catch (error) {
      res.status(400).send("Thoughts cannot be found.")
    }
})

app.post("/thoughts", async(req, res) => {
  const {message} = req.body
  try {
    const thought = await new Thoughts({message}).save()
    res.status(200).json({
      success: true,
      response: thought,
      message: "New thought has been sent."
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Thoughts cannot be sent."
    })    
  }
});

app.get("/thoughts/:id", async (req, res) => {
  try {
    const thought = await Thoughts.findById(req.params.id);
    if (thought) {
      res.status(200).json(thought);
    } else {
      res.status(404).json({ error: "Thoughts cannot be found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error fetching thought", details: err.message });
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const thoughtId = req.params.id
  try{
    const likedThought = await Thoughts.findByIdAndUpdate(
      thoughtId, 
      {$inc: {hearts: 1}}, 
      {new: true}
    )
    res.status(201).json(await likedThought.save())
  }catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: error.message
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});