import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A message minimun of 5 characters is required'],
    trim: true,
    minlength: [5, 'Please type a message at least 5 characters long'],
    maxlength: [
      140,
      'You have exceded the maximun amount of characters of 140, please shorten the message',
    ]
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

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json(listEndpoints(app));
});

app.get('/thoughts', async (req, res) => {
  const page = Number(req.query.page)
  const per_page = Number(req.query.per_page)

  const allThoughts = await Thought.find()
    .skip((page - 1) * per_page)
    .limit(per_page)
    .sort({ createdAt: -1 })

  res.json(allThoughts);
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.json(newThought);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { new: true }
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

app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId });
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
});

app.patch('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      req.body,
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

app.put('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findOneAndReplace(
      { _id: thoughtId },
      req.body,
      { new: true }
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

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
