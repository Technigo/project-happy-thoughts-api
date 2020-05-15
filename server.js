import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 140,
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

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello happy thoughts');
});

// Get the thoughts from database
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
  res.json(thoughts);
});

// Put new thoughts into the database
app.post('/thoughts', async (req, res) => {
  const thought = new Thought({ message: req.body.message });
  try {
    //Sucess
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: 'Could not save happy thought',
      errors: err.errors,
    });
  }
});

// Add likes to an existing thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  const likedThought = await Thought.updateOne(
    { _id: thoughtId },
    { $inc: { hearts: 1 } }
  );
  res.json(likedThought);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
