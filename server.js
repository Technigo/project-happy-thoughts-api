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

app.post('/thoughts', async (req, res) => {
  console.log(req.body);
  const thought = new Thought({ message: req.body.message });
  await thought.save();
  res.json(thought);
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find();
  res.json(thoughts);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
