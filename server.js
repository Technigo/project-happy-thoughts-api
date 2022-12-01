import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happy-thoughts';
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
app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});

const ThoughtSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Thought'
  },
  message: {
    type: String,
    minlength: 4,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema);

app.post('/thoughts', async (req, res) => {
  // send the data as req.body, and this is how you receive it:
  console.log(req.body);
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({
      success: true,
      response: newThought
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      response: error
    });
  }
});

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  const thoughtToUpdate = await Thought.findByIdAndUpdate(
    id,
    { $inc: { hearts: 1 } },
    { new: true }
  );
  try {
    console.log(thoughtToUpdate);
    res.status(200).json(thoughtToUpdate);
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error
    });
  }
});

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find({}).sort({ createdAt: -1 });

    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({ success: false, body: error });
  }
});

////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
