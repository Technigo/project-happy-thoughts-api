import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

dotenv.config();

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
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
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
    res.status(404).send({ err: "Page not found" });
  }
});

app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec(); // Think about implementing .skip method for pagination on the frontend
    res.json(thoughts);
  } catch (err) {
    res.status(404).send({ err: "Page not found" });
  }
});

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
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
    const updatedHeart = await Thought.findByIdAndUpdate(thoughtId, { $inc: { heart: 1 } }, { new: true });
    if (updatedHeart) {
      res.json(updatedHeart);
    } else {
      res.status(404).json({ message: 'Could not find the thought in the database.' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not add a like to the thought in the database.', err });
  }
});

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(id);
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

app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMessage = await Thought.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Could not find the thought in the database.' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not update the thought in the database.', err });
  }
});

app.put('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMessage = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true });
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
