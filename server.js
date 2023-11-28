import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints';
mongoose.set('strictQuery', false);

require('dotenv').config();


const mongoUrl = process.env.MONGO_URI || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = Promise;

// Mongoose model for thoughts
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120
  },
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hearts: {
    type: Number,
    default: 0
  }
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({ endpoints });
});

// Get all thoughts
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
    res.json(thoughts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//post a thought
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    if (message.length < 5 || message.length > 140) {
      throw new Error('Invalid message length');
    }

    const thought = new Thought({ message });

    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
});

// Post a like for a thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Increment the hearts count
    thought.hearts += 1;
    const savedThought = await thought.save();

    res.status(201).json(savedThought);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Thought not found. Could not add a like.!', error: error.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
