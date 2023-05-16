import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose Thought model
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20);
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new Thought({message});
  
  try {
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (e) {
    res.status(400).json({message: 'Could not save thought', error: e});
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  // holds the request-id
  const likeRequestId = req.params.thoughtId;
  // Full thoughts list (matches)
  const likedThought = await Thought.findById(likeRequestId);
  console.log(likedThought);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
