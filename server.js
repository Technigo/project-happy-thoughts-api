import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

// MongoDB connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the Mongoose model for the "Thought" collection
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
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
  }
});

// Set the port for the Express application
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Route to list all endpoints
app.get('/', (req, res) => {
  try {
    // Use express-list-endpoints to generate a list of endpoints
  const endpoints = listEndpoints(app);
  res.json(endpoints);
} catch (err) {
  // Handle errors and respond with a 500 Internal Server Error
  console.error('Error while retrieving endpoints:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.errors });
}
});

// Route to get thoughts
app.get('/thoughts', async (req, res) => {
  try {
    // Retrieve up to 20 thoughts, sorted by createdAt in descending order
const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
res.json(thoughts);
} catch (err) {
  // Handle errors and respond with a 500 Internal Server Error
  console.error('Error while retrieving thoughts:', err);
  res.status(500).json({ message: 'Internal Server Error' });
}
});

// Route to post new thoughts
app.post('/thoughts', async (req, res) => {
    // Retrive the information sent by the client to our API endpoint
  const {message, hearts} = req.body;
    // Use our mongoose model to create the database entry
  const thought = new Thought({message});

  try {
    // Attempt to save the thought to the database and save thought if it's valid
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
        // Handle errors if the thought cannot be saved
    res.status(400).json({message: 'Could not save thought to the database', error: err.errors});
  }
});

// Route to like a thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
    // Extract the thoughtId from the URL parameters
  const thoughtId = req.params.thoughtId;

   // Check if the thoughtId is a valid MongoDB ObjectId
   if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
    return res.status(400).json({ message: 'Invalid thoughtId' });
  }

  try {
        // Find the thought by its id
    const thought = await Thought.findById(thoughtId);

        // If the thought is not found, return a 404 status
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
        // Increment the hearts property by one
    thought.hearts += 1;

        // Save the updated thought
    const updatedThought = await thought.save();
        // Return the updated thought as a response
    res.json(updatedThought);
  } catch (err) {
        // Handle errors, e.g., internal server error
    res.status(500).json({message: 'Internal server error', error: err.errors});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
