import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import allEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
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

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140,
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send({
    'Hello!': "This is Sofie's Happy Thoughts API.",
    'Here you can watch the API live':
      'https://graceful-lily-1fde84.netlify.app/',
    'And see all endpoints here': '/endpoints',
  });
});

app.get('/endpoints', (req, res) => {
  res.send(allEndpoints(app));
});

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: 'Sorry! Could not find any thoughts.',
      error: err.errors,
    });
  }
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message: message }).save();
    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: 'Sorry! Could not save your thought.',
      error: err.errors,
    });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thoughtToLike = await Thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1 },
    });
    res.status(201).json(thoughtToLike);
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: 'Sorry! Could not like this thought.',
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
