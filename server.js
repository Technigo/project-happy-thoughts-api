import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const corsOptions = {
  origin: 'https://happythoughtsfrontend.netlify.app', // Your frontend's URL
  optionsSuccessStatus: 200
};

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const port = process.env.PORT || 8080;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [5, 'Message must be at least 5 characters'],
    maxlength: [140, 'Message can be no longer than 140 characters']
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

const Thought = mongoose.model('Thought', thoughtSchema);

app.get('/', (req, res) => {
  res.send('Hello Technigo!');
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20);
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  try {
    const { message } = req.body;
    const newThought = await Thought.create({ message });
    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (thought) {
      res.json(thought);
    } else {
      res.status(404).json({ message: 'Thought not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
