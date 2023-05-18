import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/happy-thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//new thought
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Welcome to my Happy Thoughts API');
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec();
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.status(200).json(newThought);
  } catch (err) {
    res.status(400).json({
      message: 'Could not save thought to the Database',
      error: err.errors
    });
  }
});

//endpoint for liking a thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  const response = {
    success: true,
    body: {}
  };
  // try to update the heart count
  try {
    const likedThought = await Thought.findById(thoughtId);
    const addHeart = likedThought.heart + 1;
    // console.log(likedThought)
    const updateHearts = await Thought.findByIdAndUpdate(thoughtId, {
      heart: addHeart
    });
    response.body = updateHearts;
    res.status(201).json(response);
    //if it fails, send error message
  } catch (error) {
    response.success = false;
    response.body = { message: error };
    res.status(400).json(response);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
