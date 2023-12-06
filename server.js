import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Happyapp";
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


const Thought = require('./models/thought'); // correct the path here

app.get('/', (req, res) => {
    try {
        const endpoints = listEndpoints(app);
        res.json({
            message: 'Welcome to the Happy Thoughts API - spreading happiness over the world',
            availableEndpoints: endpoints
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});
//Route to get all thoughts
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch thoughts, please try again', error: error });
  }
});

// Route to create a new thought
app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body;
    // Validate input
    if (!message || message.length < 1 || message.length > 140) {
      return res.status(400).json({ message: 'Message must be between 1 and 140 characters' });
    }

    const newThought = new Thought({ message });
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ message: 'Could not save thought, please try again', error: error });
  }
});

//Route to like a thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    thought.hearts += 1;
    const updatedThought = await thought.save();
    res.json(updatedThought);
  } catch (error) {
    res.status(400).json({ message: 'Could not update thought', error: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});