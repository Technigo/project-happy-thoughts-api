import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Middlewares ------------------------------------
app.use(cors());
app.use(bodyParser.json());

// Models ------------------------------------
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
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

// Routes ------------------------------------
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/thoughts', async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec();
  try {
    res.status(200).json(allThoughts);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.post('/thoughts', async (req, res) => {
  try {
    const thought = new Thought({ message: req.body.message });
    await thought.save();
    res.status(200).json(thought);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.post('/thoughts/:id/like', async (req, res) => {
  try {
    await Thought.updateOne({ _id: req.params.id }, { $inc: { hearts: 1 } });
    res.status(201).json({ Success: 'Like was successfully added!' });
  } catch (err) {
    res.status(400).json({ error: err.error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
