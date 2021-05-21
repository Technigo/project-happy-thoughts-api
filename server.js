import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  },
  user: {
    type: String
  },
  tag: {
    type: String
  }
});

const Thought = mongoose.model('Thought', thoughtSchema);

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ err: 'Service unavailable' });
  }
});

// Routes 
app.get('/', (req, res) => {
  try {
    res.send(listEndpoints(app));
  } catch (err) {
    res.status(404).json({ err: 'Page not found' });
  }
});

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
    if (thoughts) {
      res.json(thoughts);
    } else {
      res.status(404).json({ err: 'Could not find any thoughts in the database.' });
    }
  } catch (err) {
    res.status(404).json({ err: 'Page not found' });
  }
});

app.get('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId).exec();
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ err: 'Could not find the thought in the database.' });
    }
  } catch (err) {
    res.status(400).json({ err: 'Page not found' });
  }
});

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message, user: req.body.user, tag: req.body.tag }).save();
    res.status(201).json(newThought);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicated value', fields: err.keyValue })
    }
    res.status(400).json({ message: 'Could not save the thought to the database.', err });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedHeart = await Thought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } }, { new: true });
    if (updatedHeart) {
      res.json(updatedHeart);
    } else {
      res.status(404).json({ message: 'Could not find the thought in the database.' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not add a like to the thought in the database.', err });
  }
});

app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(thoughtId);
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: 'Could not find the thought in the database.' });
    }
    res.json(deletedThought);
  } catch (err) {
    res.status(400).json({ message: 'Could not delete the thought in the database.', err });
  }
});

app.patch('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedMessage = await Thought.findByIdAndUpdate(thoughtId, req.body, { new: true });
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Could not find the thought in the database.' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not update the thought in the database.', err });
  }
});

app.put('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedMessage = await Thought.findOneAndReplace({ _id: thoughtId }, req.body, { new: true });
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Could not find the thought in the database.' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not update the thought in the database.', err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
