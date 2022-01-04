import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// first thing to do define the model, spefing the type with schema of properties
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140, 
    trim: true
  },
  username: {
    type: String,
    maxLength: 20,
    default: 'Anonymous'
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// creating model with types of schema from thoughtschema
const Thought = mongoose.model('Thought', ThoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
});

// getting all of the thoughts and sorting them
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts)
});

// post the message
app.post('/thoughts', async (req, res) => {
  const { message, username } = req.body;

  try {
    const newThought = await new Thought({ message, username }).save();
    res.status(201).json({ response: newThought, username });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// update for likes 
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // first argument passing id, second what property should be updated
    const thoughtLiked = await Thought.findByIdAndUpdate(
      thoughtId, 
      { $inc: { hearts: 1 } }, { new: true }
    ); // inc = inscrese, new is options of that method 
    res.status(201).json({ message: thoughtLiked, success: true })
  } catch (err) {
    res.status(400).json({ message: "Could not find that Thought", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
