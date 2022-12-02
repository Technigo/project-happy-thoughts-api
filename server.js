import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const ThoughtsSchema = new mongoose.Schema({
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
  },
});

const Thoughts = mongoose.model("Thoughts", ThoughtsSchema);

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thoughts.find().sort({createdAt: "desc"}).limit(20).exec();
  res.json(thoughts);
})

app.post("/thoughts", async (req, res) => {
  const {message} = req.body;
  const thought = new Thoughts({message})
  try{
    const savedThought = await thought.save();
    res.status(200).json(savedThought)
  } catch (error) {
    res.status(400).json({message: "Could not execute", response: error})
  }
})

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
const { thoughtId } = req.params
try {
const likesToUpdate = await Thoughts.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
res.status(200).json({success: true, response: `There are ${likesToUpdate.hearts} likes on this post`})
} catch (error) {
  res.status(400).json({success: false, response: error})
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});