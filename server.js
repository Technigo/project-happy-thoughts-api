import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { restart } from 'nodemon';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/happyThoughtsMarpet';
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
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/thoughts', async (req, res) => {
  const {
    sort,
    page,
    perPage,
    sortNum = Number(sort),
    pageNum = Number(page),
    perPageNum = Number(perPage),
  } = req.query;

  // v1 Mongoose
  const thoughts = await Thought.find({})
    .sort({ createdAt: sortNum })
    .skip((pageNum - 1) * perPageNum)
    .limit(20);

  // v2 Mongo
  // const members = await Member.aggregate([
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

  res.status(200).json({ response: thoughts, success: true });
});

// v1 try catch form
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// v2 - promises
// app.post('/members', (req, res) => {
// 	const { name, description } = req.body;

// 	new Member({ name, description })
// 		.save()
// 		.then((data) => {
// 			res.status(201).json({ response: data, success: true });
// 		})
// 		.catch((error) => {
// 			res.status(400).json({ response: error, success: false });
// 		});
// });

// v3 - mongoose callback
// app.post('/members', (req, res) => {
// 	const { name, description } = req.body;

// 	new Member({ name, description }).save((error, data) => {
// 		if (error) {
// 			res.status(400).json({ response: error, success: false });
// 		} else {
// 			res.status(201).json({ response: data, success: true });
// 		}
// 	});
// });

app.post('/thoughts/:id/hearts', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      // Argument 1 - id
      id,
      // Argument 2 - properties to change - should it say score inst of hearts?
      {
        $inc: {
          hearts: 1,
        },
      },
      // Argument 3 - options (not mandatory)
      {
        new: true,
      }
    );
    res.status(200).json({ response: updatedThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true });
    } else {
      res
        .status(404)
        .json({ response: 'Happy thought not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.patch('/thoughts/:id', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  // v1 async

  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: id },
      { message }, // is this correct??
      { new: true }
    );
    if (updatedThought) {
      res.status(200).json({ response: updatedThought, success: true });
    } else {
      res
        .status(404)
        .json({ response: 'Happy Thought not found', success: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }

  // v2 promises
  // Member.findOneAndUpdate({ _id: id }, { name }, { new: true })
  //   .then((updatedMember) => {
  //     if (updatedMember) {
  //       res.status(200).json({ response: updatedMember, success: true });
  //     } else {
  //       res.status(404).json({ response: 'Member not found', success: false });
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(400).json({ response: error, success: false });
  //   });
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
