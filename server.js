/* eslint-disable no-nested-ternary */
/* eslint-disable linebreak-style */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true 
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const thoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'You have to write a message'],
    minlength: [5, 'Your message must be at least 5 characters'],
    maxlength: [140, 'Your message can not be longer than 140 characters']
  },
  name: {
    type: String,
    default: 'Anonymous',
    maxlength: 20
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

const Thought = mongoose.model('Thought', thoughtsSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json(listEndpoints(app))
});

// GET all thoughts
app.get('/thoughts', async (req, res) => {
  const { page, sort } = req.query;
  const pageSize = 20;

  // Skip 20 results per page
  const pageResults = (page) => {
    return ((page - 1) * pageSize)
  };

  // Sort thoughts on either most liked, newest or oldest.
  // Default set to newest
  const sortThoughts = (sort) => {
    if (sort === "hearts") {
      return { hearts: -1 };
    } else if (sort === "oldest") {
      return { createdAt: 1 };
    } else {
      return { createdAt: -1 };
    }
  };

  const allThoughts = await Thought.find()
    .sort(sortThoughts(sort))
    .limit(20)
    .skip(pageResults(page))
    .exec();

  // Get all thoughts to use for page count
  const countThoughts = await Thought.countDocuments();

  try {
    return allThoughts.length > 0
      ? res.json({ allThoughts, pagesTotal: Math.ceil(countThoughts / pageSize) })
      : res.json({ result: 'No thoughts!' });
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error });
  }
});

// POST request for sending thought
app.post('/thoughts', async (req, res) => {
  const { message, name } = req.body;

  try {
    const newThought = await new Thought({ message, name: name || 'Anonymous' }).save();
    res.json(newThought);
  } catch (error) {
    res.status(400).json(error);
  }
});

// POST request for likes
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true } 
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Not found!' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// PATCH for updating thought
app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Not found!' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// DELETE thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedThought = await Thought.findByIdAndDelete(id);
    if (deletedThought) {
      res.json(deletedThought)
    } else {
      res.status(404).json({ message: 'Not found!' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
});
