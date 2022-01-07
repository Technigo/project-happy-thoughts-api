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
    unique: true,
    minlength: 5,
    maxlength: 140,
    trim: true, // this trims whitespace that the user might accidentally add, default of trim is false
    //  enum: ['Jennie', 'Matilda', 'Karin', 'Maksymilian'],
  },

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
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20);
  res.json(thoughts);
});
// const {
//   sort,
//   page,
//   perPage,
//   pageNum = Number(page),
//   perPageNum = Number(perPage),
//   sortNum = Number(sort),
// } = req.query; // how many we want to skip and how many we want per page, query params are ALWAYS strings, so we have to turn them into numbers

// version 1 - mongoose
// const thoughts = await Thought.find({})
//   .sort({ createdAt: sortNum })
//   .skip((pageNum - 1) * perPageNum)
//   .limit(perPageNum);

// version 2 -mongo
// const thoughts = await Thought.aggregate([
//   {
//     $sort: {
//       createdAt: sortNum,
//     },
//   },
//   {
//     $skip: (pageNum - 1) * perPageNum,
//   },
//   {
//     $limit: perPageNum,
//   },
// ]);

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

app.post('/thoughts/:id/heart', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedHeart = await Thought.findByIdAndUpdate(id, {
      $inc: { heart: 1 },
    });
    if (updatedHeart) {
      res.status(200).json({ response: updatedHeart, success: true });
    } else {
      res.status(404).json({ response: 'Not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Delete Thought by Id
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true });
    } else {
      res.status(404).json({ response: 'Thought not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
