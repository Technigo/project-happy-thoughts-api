import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
  // message: String,
  // hearts: Number,
  message: {
    type: String,
    required: true,
    // unique: true,
    minlength: 5,
    maxlength: 140,
    trim: true
    // enum: ['Jennie', 'Matilda', 'Karin', 'Maks'] (array of string, specify allowed values)
  },
  hearts: {
    type: Number,
    default: 0
    // maxlength: 10,
    // trim: true the whitespaces before and after text block will
    // be ignored if it is a lot, not the whitespaces between the words
  },
  // score: {
  //   type: Number,
  //   default: 0
  // },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ respose: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
