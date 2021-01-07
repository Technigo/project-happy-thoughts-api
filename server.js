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
  name: {
    type: String,
    default: 'Anonymous',
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

// Error variables
const SERVICE_UNAVAILABLE = 'Service unavailable';
const BAD_REQUEST = 'Bad request';
const POST_FAILED = 'Could not post thought';
const NOT_FOUND = 'Thought was not found';

const listEndpoints = require('express-list-endpoints');

// Error message if database connection is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).send({ error: SERVICE_UNAVAILABLE });
  }
});

// / endpoint (root)
// RETURNS: A list of all endpoints as an array
//
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// GET /thoughts endpoint
// RETURNS: A collection of all thoughts from MongoDB as an array
//
// PARAMETERS:
// - sort: a string
//    usage: /eruptions?sort=hearts
app.get('/thoughts', async (req, res) => {
  const { sort, page } = req.query;

  // Pagination for infinite scroll
  const pageNumber = +page || 1;
  const pageSize = 10 * pageNumber;

  // Get all thoughts
  const allThoughts = await Thought.find();

  // Sort thoughts on query, newest by default
  const sortThoughts = sort => {
    if (sort === 'hearts') {
      return { hearts: -1 };
    } else if (sort === 'oldest') {
      return { createdAt: 1 };
    } else {
      return { createdAt: -1 };
    }
  };

  // Get all thoughts, sort and limit
  const thoughts = await Thought.find()
    .sort(sortThoughts(sort))
    .limit(pageSize)
    .exec();

  if (thoughts) {
    res.status(200).send({ total: allThoughts.length, results: thoughts });
  } else {
    res.status(400).send({ error: BAD_REQUEST, error: err.errors });
  }
});

// POST /thoughts endpoint
// Post a thought
app.post('/thoughts', async (req, res) => {
  const { message, name } = req.body;
  try {
    // Success
    const thought = await new Thought({ message, name }).save();
    res.status(201).send(thought);
  } catch (err) {
    // Bad request
    res.status(400).send({ message: POST_FAILED, errors: err.errors });
  }
});

// POST /thoughts/:id/like endpoint
// Post a like
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } });
    res.status(201).send();
  } catch (err) {
    res.status(400).send({ message: NOT_FOUND });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
