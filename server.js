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
    maxlength: 140
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

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Thought.deleteMany();
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const myEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Const's for error messages instead of text in error handling
const SERVICE_UNAVAILABLE = 'Service unavailable.';
const NO_ENDPOINTS_FOUND = 'No endpoints found, try again later!';
const NO_THOUGHTS_FOUNDS = 'No thoughts found.';
const COULD_NOT_SAVE_THOUGHT = 'Could not save thought to the database.';
const COULD_NOT_SAVE_LIKE = 'Could not save like for ID:';

// Error message in case server is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next(); // To execute next get response
  } else {
    res.status(503).send({ error: SERVICE_UNAVAILABLE });
  }
});

// / endpoint (Root - Homepage)
// RETURNS: A list of available endpoints (in an array)
app.get('/', (req, res) => {
  if (res) {
    res.status(200).send(myEndpoints(app));
  } else {
    res.status(404).send({ error: NO_ENDPOINTS_FOUND });
  }
});

// GET /thoughts
// RETURNS: A list of maximun 20 thoughts, sorted by createdAt desc as default to show the most recent one thoughts first.
//          PAGINATION as default with 20 results per page.
//
// PARAMETERS:
//  - sort
//     usage: //thoughts/?sort=likes
//     usage: //thoughts/?sort=oldest
//  - page
//     usage: /thoughts/?page=4
app.get('/thoughts', async (req, res) => {
  const { sort, page } = req.query;
  const pageNumber = +page || 1;
  const pageSize = 20;

  // skip: E.g. page 3: 20 * (3-1) = 40, sends 40 as parameter to .skip()
  // skips index 0-39 so that page 3 starts with the thought that has index 40
  const skip = pageSize * (pageNumber - 1);

  //Sets default sorting to newest first
  const sortThoughts = (sort) => {
    if (sort === 'likes') {
      return {
        hearts: -1
      };
    } else if (sort === 'oldest') {
      return {
        createdAt: 1
      };
    } else {
      return {
        createdAt: -1
      };
    }
  };

  // Paginated using limit and skip, change page using page query
  const thoughts = await Thought.find()
    .sort(sortThoughts(sort))
    .limit(pageSize)
    .skip(skip)
    .exec();

  if (thoughts) {
    res.status(200).json(thoughts);
  } else {
    res.status(404).json({ error: NO_THOUGHTS_FOUNDS });
  }
});

// POST /thoughts - Post a thought
app.post('/thoughts', async (req, res) => {
  // Retrive the information sent by the client to our API endpoint
  const { message } = req.body;

  try {
    // Success
    const thought = await new Thought({ message }).save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({
      message: COULD_NOT_SAVE_THOUGHT,
      error: err.errors
    });
  }
});

// POST /thoughts/:thoughtId/like - Like a thought
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    // Success
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } });
    res.status(201).send();
  } catch (err) {
    res.status(400).json({
      message: `${COULD_NOT_SAVE_LIKE} ${id}`,
      error: err.errors
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
