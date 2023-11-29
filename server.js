import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  //Should not be assignable when creating a new thought
  hearts: {
    type: Number,
    default: 0,
  },
  //Should not be assignable when creating a new thought
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Thoughts = mongoose.model('Thoughts', ThoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// --------------- Get the 20 thoughts ---------------
app.get('/thoughts', async (req, res) => {
  try {
    const messages = await Thoughts.find().sort({ createdAt: 'desc' }).limit(20).exec();
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: 'Internal Server Error', error: err.message });
  }
});
// --------------- Post thoughts ---------------
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  console.log(message);
  const newMessage = new Thoughts({ message });
  try {
    const saveMessage = await newMessage.save();
    res.status(201).json(saveMessage);
  } catch (err) {
    res.status(400).json({ message: 'Could not save thought to the database', error: err.message });
  }
});
// ---------------  likes ---------------
app.post('/thoughts/:_id/love', async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    const updatedThought = await Thoughts.findByIdAndUpdate(
      _id,
      { $inc: { hearts: 1 } },
      { new: true },
    );
    if (updatedThought) {
      return res.json(updatedThought);
    }
  } catch (err) {
    return res.status(400).json({ message: 'Thought not found', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
