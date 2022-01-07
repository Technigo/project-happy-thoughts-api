import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Schema
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({
      createdAT: -1,
    })
    .skip(0)
    .limit(20);
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body;
    const newThought = await new Thought({
      message,
    }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    });
  }
});

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  // Use findByIdAndUpdate to increase the heart with 1
  try {
    const updatedLikes = await Thought.findByIdAndUpdate(id, {
      $inc: { hearts: 1 },
    });
    res.status(200).json({ response: updatedLikes, success: true });
  } catch (error) {
    res.status(404).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
