import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//____________Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

//____________Defining routes
app.get('/', (req, res) => {
  res.send('Hello world');
});

// 3 endpoints required

// GET /thoughts
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  //'desc' instead of -1
  if (thoughts) {
    res.status(200).send(thoughts);
  } else {
    res.status(400).send({ error: 'Bad request', error: err.errors });
  }
});

// POST /thoughts
app.post('/thoughts', async (req, res) => {
  try {
    //success
    const thought = await new Thought({ message: req.body.message }).save();
    res.status(201).send(thought);
  } catch (err) {
    //bad request
    res
      .status(400)
      .send({ message: 'Could not save thought', errors: err.errors });
  }
});

// POST thoughts/:thoughtId/like
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    await Thought.updateOne({ _id: id }, { $inc: { hearts: 1 } });
    res.status(201).send();
  } catch (err) {
    res.status(400).send({ message: `${id} was not found` });
  }

  /****
  - findOneAndUpdate https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate 
  - try (success) / catch (error)
  ****/
});

//____________Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
