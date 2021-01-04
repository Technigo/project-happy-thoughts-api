import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// mongoose model for Thought
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140
  },
  username: {
    type: String,
    maxLength: 20,
    default: 'Anonymous'
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// MAYBE: Add a Reset database function, in case we'd like to restart with a clean slate?

// ENDPOINTS
app.get('/', (req, res) => {
  res.send('Hello world, welcome to Happy Thoughts API - Vanessa version <3');
})

// GET /thoughts : Endpoint showing the 20 most recent thoughts------------------------------------------------
app.get('/thoughts', async (req, res) => {
  // Pagination: destructure page and limit and set default values
  const { page = 1, limit = 20 } = req.query;

  try {
    // execute query with page and limit values
    const thoughts = await Thought.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 'desc' })
      .exec();

    // get total entries in the Thought collection
    const count = await Thought.countDocuments();

    // return response with thoughts, total pages and current page
    res.json({
      thoughts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
  };
});

// POST /thoughts : Endpoint to add a new Thought to the database----------------------------------------------
app.post('/thoughts', async (req, res) => {
  // Retrieve message and username sent by the client in the POST request body
  const { message, username } = req.body;

  // use mongoose model to create a new Thought using the message we got from the client
  // If the username field is empty, the username will show as Anonymous
  const thought = new Thought({ message, username: username || 'Anonymous' });

  try {
    // Success case: Add a new instance of Thought to the database by calling save() on it
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: "Could not save Thought to the database", error: err.errors });
  }
});

// POST /thoughts/:thoughtId/like : Endpoint to add a heart "like" to a specific thought------------------------
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    const thoughtLiked = await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    res.json(thoughtLiked);
  } catch (err) {
    res.status(400).json({ message: "Could not find that Thought", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
