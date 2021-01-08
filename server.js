import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Middleware 
app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      req.status(503).json({ error: 'Service unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error! Could not access the server.' });
  }
});

// Model for thought with properties message, heart and createdAt
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true, 
    minlength: 5,
    maxlength: 140
  },
  name: {
    type: String,
    default: "Anonymous"
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

// Start defining your routes here
const listEndpoints = require('express-list-endpoints');
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

  //GET /thoughts = returning an endpoint of maximum 20 thoughts sorted by createdAt to show the most recent thoughts first
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
});

  //POST /thoughts
app.post('/thoughts', async (req, res) => {
    // Try catch form 
  try {
    // Success
    const { message, name } = req.body;
    const newThought = await new Thought({ message, name }).save();
    
    res.status(200).json(newThought);
    // Bad request = error 
  } catch (err) {
    res.status(400).json({ message: 'Could not save happy thought!', errors:err.errors});
  }
});

  // POST /thoughts/:thoughtId/like
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    // Success
    await Thought.updateOne({ _id: req.params.thoughtId }, { $inc: { hearts: 1 } });
    res.status(200).json();
    // Bad request = error 
  } catch (err) {
    res.status(400).json({ message: 'Could not like this thought', errors:err.errors});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
