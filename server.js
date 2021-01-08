import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Happy Thoughts API! Here you will only see happy thoughts. You can also post your happy thoughts');
});

//GET requests
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc'}).limit(20).exec;
  res.json(thoughts);
});

//POST requests

app.post('/thoughts', async (req, res) => {
  try {
//Retrieving the info sent by the client. 
    const { message } = req.body;
//By doing await new Thought({ message }).save();instead of saving the entire req.body 
//like await new Thought(req.body).save() we are only saving the message sent my the client. 
//Any other info sent by the client will not be saved and it's more secure this way.
//Now the client can't update the number of likes by sending hearts in the post request.    
    const newThought = await new Thought({ message }).save();
    res.status(200).json(newThought);
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    const thoughtLiked = await Thought.updateOne({ _id: req.params.thoughtId}, {  $inc: { hearts: 1 } });
    res.status(200).json(thoughtLiked);
  } catch (error) {
    res.status(400).json({ message: 'Thought was not found', error: error.errors});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
