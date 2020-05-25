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
    minlength: 5,
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
// Get the thoughts from database
app.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (err) {
    res.status(400).json({
      message: 'Could not find any happy thoughts',
      errors: err.errors,
    });
  }
});

// Add new thoughts to the database
app.post('/', async (req, res) => {
  const thought = new Thought({ message: req.body.message }); // stops user from manipulating likes
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
app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const likedThought = await Thought.updateOne(
      { _id: thoughtId },
      { $inc: { hearts: 1 } }
    );
    res.json(likedThought);
  } catch (err) {
    res
      .status(401)
      .json({ message: 'Heart was not added to thought.', errors: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
