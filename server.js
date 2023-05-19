import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happy-thoughts";
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

// Thought schema
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 400,
    required: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Model for ThoughtSchema
const Thought = mongoose.model('Thought', ThoughtSchema)


// Start defining your routes here
// GET: List of endpoints
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

// GET: List of 20 most recent thoughts, in descending order.
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  if (thoughts) {
    res.json(thoughts)
  } else {
    res.status(404).json({ error: "thoughts not found" })
  }
})

// POST: Thought is posted to the database, if message fits validation rules.
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({
      message: message
    }).save()
    res.status(200).json({
      succes: true,
      response: `This thought was posted: ${newThought}` 
    })
  } catch (err) {
      res.status(400).json({
        succes: false,
        response: 'Thought could not be posted',
        errors: err.errors
    })
  }
})

// POST: Increases the number of hearts by 1.
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const heartUpdate = await Thought.findByIdAndUpdate (id, { $inc: { hearts: 1 } });
    res.status(200).json({
      success: true,
      response: `Heart-count was updated for post  ${heartUpdate.id}`
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: 'Heart-count could not update',
      error: err.errors
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});