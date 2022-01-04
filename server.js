import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/happyThoughtsAPI';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Create a schema for the thoughts (input from user)

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
    trim: true
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

// Pass the schema to the model

const Thought = mongoose.model('Thought', ThoughtSchema);

// Default route
app.get('/', (req, res) => {
  res.send('Hello world');
});

// Sort thoughts by createdAt and return the most recent thoughts first (max. 20 of them)
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(404).json({ response: error, success: false });
  }
});

// Retrieve the info sent by the client to our API endpoint
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Update a thought's hearts property (if the thought has a valid URL)
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          heart: 1
        }
      },
      {
        new: true
      }
    );
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
