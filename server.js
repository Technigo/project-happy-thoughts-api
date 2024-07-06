import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import expressListEndpoints from 'express-list-endpoints';

// Load environment variables
dotenv.config();

// Set mongoose options to suppress the deprecation warning
mongoose.set('strictQuery', false); // Add this line

// Connect to MongoDB database
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/project-happy-thoughts';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define Mongoose schema for Thought model
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
    set: () => 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    set: () => Date.now()
  },
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Initialize Express app
const app = express();
const port = process.env.PORT || 27017;

// Middleware setup
app.use(cors());
app.use(express.json());

// Define routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Happy Thoughts API',
    endpoints: expressListEndpoints(app),
  });
});

// GET /thoughts - Get the 20 most recent thoughts
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    res.status(500).json({ message: 'Error fetching thoughts', error: error.message });
  }
});

// POST /thoughts - Create a new thought
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = new Thought({ message });
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    console.error('Error saving thought:', error);
    res.status(500).json({ message: 'Error saving thought', error: error.message });
  }
});

// POST /thoughts/:thoughtId/like - Increment hearts of a thought by ID
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.status(200).json(thought);
  } catch (error) {
    console.error('Error liking thought:', error);
    res.status(500).json({ message: 'Error liking thought', error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
