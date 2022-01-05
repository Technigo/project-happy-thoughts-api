/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable arrow-parens */
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
  message: {
    type: String,
    required: true,
    // unique: true,
    //  enum: ['Jennie', 'Matilda', 'Karin', 'Maksymilian'],
  },
  // description: {
  //   type: String,
  //   minlength: 5,
  //   maxlength: 140,
  //   trim: true, // this trims whitespace that the user might accidentally add, default of trim is false
  // },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(), // could also pass Date.now and change the type to Number
  },
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.json('Hello World');
});

app.get('/thoughts', async (req, res) => {
  const {
    page,
    perPage,
    pageNum = Number(page),
    perPageNum = Number(perPage),
  } = req.query; // how many we want to skip and how many we want per page, query params are ALWAYS strings, so we have to turn them into numbers

  const thoughts = await Thought.find({})
    .sort({ createdAt: 'desc' })
    .skip((pageNum - 1) * perPageNum)
    .limit(perPageNum);

  res.status(200).json({ response: thoughts, success: true });
});

// version 1 - async/await
app.post('/thoughts', async (req, res) => {
  try {
    const thought = await new Thought(req.body).save();
    res.status(200).json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'could not save thought', errors: error.errors });
  }
});

// version 2 - promises
// app.post('/members', (req, res) => {
//   const { name, description } = req.body;
//   new Member({ name, description })
//     .save()
//     .then(data => {
//       res.status(201).json({ response: data, success: true });
//     })
//     .catch(error => {
//       res.status(400).json({ response: error, success: false });
//     });
// });

// version 3 - mongoose callback
// app.post('/members', (req, res) => {
//   const { name, description } = req.body;
//   new Member({ name, description }).save((error, data) => {
//     if (error) {
//       res.status(400).json({ response: error, success: false })
//     } else {
//       res.status(201).json({ response: data, success: true })
//     }
//  })
// });

// PUT OR PATCH, put replaces entity, patch updates entity. Restful API is purely semantical (doesn't have any meaning other than we should understand the task for the endpoint)

// to update the amount of likes on happy Thoughts, find the member (or thought) by the id

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedHeart = await Thought.findByIdAndUpdate(
      // Argument 1 - id
      id,
      // Argument 2 - properties to change
      {
        $inc: {
          score: 1,
        },
      },
      // Argument 3 - options (not mandatory)
      {
        new: true,
      }
    );
    res.status(200).json({ response: updatedHeart, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
