import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Defines the port the app will run on. 
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Routes start here
app.get('/', (req, res) => {
  res.send('This API stores Happy Thoughts only!')
});

// Endpoint created to get a list of the 20 latest thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
});

// Endpoint for POSTing thoughts and adding it to the database
app.post('/thoughts', async (req, res) => {

  try {
    // Success case
    // Retrieves the information sent by the client to the API endpoint
    const { message } = req.body;

    // Use the mongoose model to create the database entry
    const newThought = await new Thought({ message }).save();

    res.status(200).json(newThought);
  } catch (err) {
    // Bad request
    res.status(400).json({
      message: 'Could not save thought to the Database',
      errors: err.errors
    });
  }
});

// Endpoint for POSTing likes to thoughts in the list, recognize thought by ID
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    // Success case
    await Thought.updateOne({ _id: req.params.thoughtId }, { $inc: { hearts: 1 } });
    res.status(200).json();
  }
  catch (err) {
    // Bad request
    res.status(400).json({
      message: 'Could not like this thought since it was not found.',
      errors: err.errors
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
