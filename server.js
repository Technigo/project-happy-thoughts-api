import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A Happy Thought is required'],
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model('Thought', thoughtSchema);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// First page to show all endpoints.
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// Endpoint to display all Happy Thoughts
app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec();
  res.json(allThoughts);
});

// Endpoint to post new Happy Thoughts
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  const thought = new Thought({ message });
  try {
    const newThought = await thought.save();
    res.status(201).json(newThought);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Could not save to the database', error: error.errors });
  }
});

// Endpoint to update likes for each thought
app.post('/thoughts/:id/likes', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

// Endpoint to delete a Happy Thought
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
