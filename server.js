import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 140,
    trim: true // this trims whitespace that the user might accidentally add, default of trim is false
  },

  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date() // could also pass Date.now and change the type to Number
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.json('Hello World');
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20);
  res.json(thoughts);
});

// async/await
app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thought(req.body).save();
    res.status(200).json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'could not save thought', errors: error.errors });
  }
});

app.post('/thoughts/:id/hearts', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedHeart = await Thought.findByIdAndUpdate(id, {
      $inc: { hearts: 1 }
    });
    if (updatedHeart) {
      res.status(200).json({ response: updatedHeart, success: true });
    } else {
      res.status(404).json({ response: 'Not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Delete Thought by Id
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true });
    } else {
      res.status(404).json({ response: 'Thought not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
