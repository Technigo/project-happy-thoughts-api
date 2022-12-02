import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happythoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the Thought database model
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: () => 0,
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
  res.send("Hello Technigo!");
});

app.get("/thoughts", async (req, res) => {
  // Get the 20 latest thoughts by creation date
  const thoughts = await Thought.find({}).sort({createdAt: -1}).limit(20)
  res.status(200).json(thoughts)
})

app.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body
    const thought = new Thought({
      message: req.body.message
    })
    await thought.save()
    res.send(thought)  
  } catch (err) {
    res.status(400).send({message: "Failed to save thought", error: err})
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtId = req.params.thoughtId
  const thought = await Thought.findByIdAndUpdate(thoughtId, {$inc : {'hearts' : 1}}, {new: true});
  if (thought !== null) {
    res.send(thought)
  } else {
    res.status(400).send({message: "No thought with that Id"})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
