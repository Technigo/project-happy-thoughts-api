import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
// import dotenv from 'dotenv';
// require('dotenv').config();

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
    // unique: true,
    // enum: ['Jennie', 'Matilda', 'Karin', 'Maks'] (array of string, specify allowed values)
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
  // userName: {
  //   type: String,
  //   default: "Anonymous"
  // } if using this, add userName in post thoughts route
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(
    'This is the home of Happy Thoughts by Ida. Please see <a href="https://github.com/IdaAspen/project-happy-thoughts-api/blob/master/Documentation.md">documentation</a>'
  );
});

// get the endpoints
app.get('endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

// get the thoughts max 20 sorted by createdAt descending order
app.get('/thoughts', async (req, res) => {
  // const {
  //   page,
  //   perPage,
  //   pageNum = Number(page),
  //   perPageNum = Number(perPage)
  // } = req.query;

  const thoughtsList = await Thought.find({})
    .sort({ createdAt: 'desc' })
    // .skip((pageNum -1) * perPageNum)
    .limit(20); // perPageNum
  res.status(200).json({ response: thoughtsList, success: true });
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    // if (error === 'ValidatorError') {
    //   res.status(400).json({
    //     message: 'Your thought should be between 5 and 140 characters',
    //     success: false
    //   });
    // } else {
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

// app.delete('/thoughts/:thoughtId', async (req, res) => {
//   const { thoughtId } = req.params;

//   try {
//     const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId });
//     if (deletedThought) {
//       res.status(200).json({ response: deletedThought, success: true });
//     } else {
//       res.status(404).json({ response: 'Thought not found', sucess: false });
//     }
//   } catch (error) {
//     res.status(400).json({ response: error, sucess: false });
//   }
// });

// app.patch('/thoughts/:thoughtId', async (req, res) => {
//   const { thoughtId } = req.params;
//   const { updatedMessage } = req.body;
//   // should it be name: updateMessage??
//   Thought.findOneAndUpdate(
//     { _id: thoughtId },
//     { message: updatedMessage },
//     { new: true }
//   );
//   // EJ KLAR, se onsdagens lektion
// });

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
