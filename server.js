import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A message is required'],
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining routes here
app.get('/', (req, res) => {
  res.send(
    'This is the backend of Happy Thoughts by Ida. Please see <a href="https://github.com/IdaAspen/project-happy-thoughts-api/blob/master/Documentation.md">documentation</a> and <a href="https://aspen-happy-thought.netlify.app/">frontend</a> for the main page!'
  );
});

// get the endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

// get the thoughts max 20 sorted by createdAt descending order
app.get('/thoughts', async (req, res) => {
  const thoughtsList = await Thought.find({})
    .sort({ createdAt: 'desc' })
    .limit(20);
  res.status(200).json({ response: thoughtsList, success: true });
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// or use app.patch and findOneAndUpdate()
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    );
    if (updatedThought) {
      res.status(200).json({ response: updatedThought, success: true });
    } else {
      res.status(404).json({ response: 'Thought not found', sucess: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, sucess: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
