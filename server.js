import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thoughts-api";
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140 
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
} )

// GET thoughts
// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

// POST thoughts
// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = new Thought({ message });
  try {
    // Success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch(err) {
      res.status(400).json({
        message: 'Could not save thought to the Database', error: err.errors
      });
  }
})

// POST thoughts/:thoughtId/like
// This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
